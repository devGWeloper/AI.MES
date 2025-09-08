package com.ai.mes.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import com.ai.mes.config.mybatis.MyBatisQueryLoggingInterceptor;
import org.apache.ibatis.plugin.Interceptor;

import javax.sql.DataSource;

@Configuration
@MapperScan(basePackages = "com.ai.mes.mapper.next", sqlSessionTemplateRef = "nextSqlSessionTemplate")
public class NextDatabaseConfig {

    @Bean(name = "nextDataSourceProperties")
    @ConfigurationProperties("spring.datasource.next")
    public HikariConfig nextDataSourceProperties() {
        HikariConfig config = new HikariConfig();
        // PostgreSQL 최적화 설정
        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
        config.addDataSourceProperty("useServerPrepStmts", "true");
        config.addDataSourceProperty("useLocalSessionState", "true");
        config.addDataSourceProperty("rewriteBatchedStatements", "true");
        config.addDataSourceProperty("cacheResultSetMetadata", "true");
        config.addDataSourceProperty("cacheServerConfiguration", "true");
        config.addDataSourceProperty("elideSetAutoCommits", "true");
        config.addDataSourceProperty("maintainTimeStats", "false");
        return config;
    }

    @Bean(name = "nextDataSource")
    public DataSource nextDataSource(@Qualifier("nextDataSourceProperties") HikariConfig config) {
        return new HikariDataSource(config);
    }

    @Bean(name = "nextSqlSessionFactory")
    public SqlSessionFactory nextSqlSessionFactory(@Qualifier("nextDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);
        sessionFactory.setMapperLocations(
            new PathMatchingResourcePatternResolver().getResources("classpath:mapper/next/**/*.xml")
        );
        sessionFactory.setPlugins(new Interceptor[]{ new MyBatisQueryLoggingInterceptor() });
        return sessionFactory.getObject();
    }

    @Bean(name = "nextSqlSessionTemplate")
    public SqlSessionTemplate nextSqlSessionTemplate(@Qualifier("nextSqlSessionFactory") SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }

    @Bean(name = "nextTransactionManager")
    public DataSourceTransactionManager nextTransactionManager(@Qualifier("nextDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
