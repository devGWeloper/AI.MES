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
@MapperScan(basePackages = "com.ai.mes.mapper.m14", sqlSessionTemplateRef = "m14SqlSessionTemplate")
public class M14DatabaseConfig {

    @Bean(name = "m14DataSourceProperties")
    @ConfigurationProperties("spring.datasource.m14")
    public HikariConfig m14DataSourceProperties() {
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

    @Bean(name = "m14DataSource")
    public DataSource m14DataSource(@Qualifier("m14DataSourceProperties") HikariConfig config) {
        return new HikariDataSource(config);
    }

    @Bean(name = "m14SqlSessionFactory")
    public SqlSessionFactory m14SqlSessionFactory(@Qualifier("m14DataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);
        sessionFactory.setMapperLocations(
            new PathMatchingResourcePatternResolver().getResources("classpath:mapper/m14/**/*.xml")
        );
        sessionFactory.setPlugins(new Interceptor[]{ new MyBatisQueryLoggingInterceptor() });
        return sessionFactory.getObject();
    }

    @Bean(name = "m14SqlSessionTemplate")
    public SqlSessionTemplate m14SqlSessionTemplate(@Qualifier("m14SqlSessionFactory") SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }

    @Bean(name = "m14TransactionManager")
    public DataSourceTransactionManager m14TransactionManager(@Qualifier("m14DataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
