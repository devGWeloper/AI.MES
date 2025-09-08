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
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import com.ai.mes.config.mybatis.MyBatisQueryLoggingInterceptor;
import org.apache.ibatis.plugin.Interceptor;

import javax.sql.DataSource;

@Configuration
@MapperScan(basePackages = "com.ai.mes.mapper.m16", sqlSessionTemplateRef = "m16SqlSessionTemplate")
public class M16DatabaseConfig {

    @Bean(name = "m16DataSourceProperties")
    @ConfigurationProperties("spring.datasource.m16")
    public HikariConfig m16DataSourceProperties() {
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

    @Bean(name = "m16DataSource")  
    @Primary
    public DataSource m16DataSource(@Qualifier("m16DataSourceProperties") HikariConfig config) {
        return new HikariDataSource(config);
    }

    @Bean(name = "m16SqlSessionFactory")
    @Primary
    public SqlSessionFactory m16SqlSessionFactory(@Qualifier("m16DataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);
        sessionFactory.setMapperLocations(
            new PathMatchingResourcePatternResolver().getResources("classpath:mapper/m16/**/*.xml")
        );
        sessionFactory.setPlugins(new Interceptor[]{ new MyBatisQueryLoggingInterceptor() });
        return sessionFactory.getObject();
    }

    @Bean(name = "m16SqlSessionTemplate")
    @Primary
    public SqlSessionTemplate m16SqlSessionTemplate(@Qualifier("m16SqlSessionFactory") SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }

    @Bean(name = "m16TransactionManager")
    @Primary
    public DataSourceTransactionManager m16TransactionManager(@Qualifier("m16DataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
