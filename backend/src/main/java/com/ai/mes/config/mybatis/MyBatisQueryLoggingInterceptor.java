package com.ai.mes.config.mybatis;

import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.ParameterMapping;
import org.apache.ibatis.plugin.*;
import org.apache.ibatis.reflection.MetaObject;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Logs MyBatis queries with bound parameters and execution time.
 */
@Slf4j
@Intercepts({
    @Signature(type = Executor.class, method = "update", args = {MappedStatement.class, Object.class}),
    @Signature(type = Executor.class, method = "query", args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class})
})
public class MyBatisQueryLoggingInterceptor implements Interceptor {

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        Object[] args = invocation.getArgs();
        MappedStatement mappedStatement = (MappedStatement) args[0];
        Object parameterObject = args.length > 1 ? args[1] : null;
        BoundSql boundSql = mappedStatement.getBoundSql(parameterObject);
        Configuration configuration = mappedStatement.getConfiguration();

        String sqlId = mappedStatement.getId();
        String finalSql = buildSql(configuration, boundSql);

        long startNs = System.nanoTime();
        try {
            if (log.isDebugEnabled()) {
                log.debug("[MyBatis] -> {}\nSQL: {}", sqlId, finalSql);
            }
            Object result = invocation.proceed();
            long tookMs = (System.nanoTime() - startNs) / 1_000_000;
            if (log.isDebugEnabled()) {
                int rowCount = extractRowCount(result);
                log.debug("[MyBatis] <- {} ({} ms, rows={})", sqlId, tookMs, rowCount);
            }
            return result;
        } catch (Throwable t) {
            long tookMs = (System.nanoTime() - startNs) / 1_000_000;
            log.error("[MyBatis] !! {} failed ({} ms)\nSQL: {}\nERR: {}", sqlId, tookMs, finalSql, t.getMessage(), t);
            throw t;
        }
    }

    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    @Override
    public void setProperties(Properties properties) {
        // no-op
    }

    private String buildSql(Configuration configuration, BoundSql boundSql) {
        String sql = boundSql.getSql().replaceAll("\n|\r", " ").replaceAll("\\s+", " ").trim();
        List<ParameterMapping> paramMappings = boundSql.getParameterMappings();
        if (paramMappings == null || paramMappings.isEmpty()) {
            return sql;
        }

        List<String> formattedParams = new ArrayList<>();
        Object parameterObject = boundSql.getParameterObject();
        MetaObject metaObject = parameterObject == null ? null : configuration.newMetaObject(parameterObject);

        for (ParameterMapping pm : paramMappings) {
            if (pm.getMode() != org.apache.ibatis.mapping.ParameterMode.OUT) {
                String propertyName = pm.getProperty();
                Object value;
                if (boundSql.hasAdditionalParameter(propertyName)) {
                    value = boundSql.getAdditionalParameter(propertyName);
                } else if (metaObject != null && metaObject.hasGetter(propertyName)) {
                    value = metaObject.getValue(propertyName);
                } else {
                    value = null;
                }
                formattedParams.add(formatParameter(value));
            }
        }

        // Replace '?' in order with formatted parameters
        StringBuilder sb = new StringBuilder();
        int paramIndex = 0;
        for (int i = 0; i < sql.length(); i++) {
            char c = sql.charAt(i);
            if (c == '?' && paramIndex < formattedParams.size()) {
                sb.append(formattedParams.get(paramIndex++));
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }

    private String formatParameter(Object obj) {
        if (obj == null) {
            return "NULL";
        }
        if (obj instanceof Number || obj instanceof Boolean) {
            return String.valueOf(obj);
        }
        if (obj instanceof Date) {
            return "'" + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format((Date) obj) + "'";
        }
        if (obj instanceof Collection<?>) {
            String joined = ((Collection<?>) obj).stream().map(this::formatParameter).collect(Collectors.joining(", "));
            return "(" + joined + ")";
        }
        return "'" + String.valueOf(obj).replace("'", "''") + "'";
    }

    private int extractRowCount(Object result) {
        if (result == null) return 0;
        if (result instanceof Collection<?>) return ((Collection<?>) result).size();
        if (result instanceof Number) return ((Number) result).intValue();
        return 1; // default when unknown
    }
}


