# KLTN_KTDV
### Khoa: Khoa đào tạo chất lượng cao
### Đề tài khóa luận: Kiểm tra đạo văn đối với tiểu luận chuyên ngành và khóa luận tốt nghiệp.
### Thành viên trong nhóm:
+ Nguyễn Văn Thắng - 17110230
+ Nguyễn Văn Hà - 17110130
### Công nghệ sự dụng
+ Frontend: NextJs + React
+ Backend: Spring boot(Java)
+ Database: MongoDB
### setup front-end
+ Install lib: npm i
+ create .env: BASE_API_URL={BASE_BACK_END)/api
+ Start: npm run dev

### Setup for database
+ Open PgAdmin
+ Create database with name "document_manager".

### Setup for backend
+ Open project backend (DocumentManager) in your IDE.
+ Open pom.xml --> Run maven to dowload library.
+ Create enviroment variable follow:
    DB_URL=jdbc:postgresql://localhost:5432/document_manager
    DB_USERNAME=postgres
    DB_PASSWORD=postgres
    DB_DRIVER_NAME=org.postgresql.Driver
    HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
    HIBERNATE_DDL=update
    --> Change enviroment variable (DB_URL, DB_USERNAME, DB_PASSWORD) follow with your config.
+ Run project with file main have name "DocumentManagerApplication" and enviroment variable above.