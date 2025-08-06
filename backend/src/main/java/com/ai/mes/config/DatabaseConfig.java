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

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    // M14 Fab Database Configuration
    @Configuration
    @MapperScan(basePackages = "com.ai.mes.mapper.m14", sqlSessionTemplateRef = "m14SqlSessionTemplate")
    static class M14DatabaseConfig {

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

    // M15 Fab Database Configuration
    @Configuration
    @MapperScan(basePackages = "com.ai.mes.mapper.m15", sqlSessionTemplateRef = "m15SqlSessionTemplate")
    static class M15DatabaseConfig {

        @Bean(name = "m15DataSourceProperties")
        @ConfigurationProperties("spring.datasource.m15")
        public HikariConfig m15DataSourceProperties() {
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

        @Bean(name = "m15DataSource")
        public DataSource m15DataSource(@Qualifier("m15DataSourceProperties") HikariConfig config) {
            return new HikariDataSource(config);
        }

        @Bean(name = "m15SqlSessionFactory")
        public SqlSessionFactory m15SqlSessionFactory(@Qualifier("m15DataSource") DataSource dataSource) throws Exception {
            SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
            sessionFactory.setDataSource(dataSource);
            sessionFactory.setMapperLocations(
                new PathMatchingResourcePatternResolver().getResources("classpath:mapper/m15/**/*.xml")
            );
            return sessionFactory.getObject();
        }

        @Bean(name = "m15SqlSessionTemplate")
        public SqlSessionTemplate m15SqlSessionTemplate(@Qualifier("m15SqlSessionFactory") SqlSessionFactory sqlSessionFactory) {
            return new SqlSessionTemplate(sqlSessionFactory);
        }

        @Bean(name = "m15TransactionManager")
        public DataSourceTransactionManager m15TransactionManager(@Qualifier("m15DataSource") DataSource dataSource) {
            return new DataSourceTransactionManager(dataSource);
        }
    }

    // M16 Fab Database Configuration
    @Configuration
    @MapperScan(basePackages = "com.ai.mes.mapper.m16", sqlSessionTemplateRef = "m16SqlSessionTemplate")
    static class M16DatabaseConfig {

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
}