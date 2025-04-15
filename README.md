```
vietlegal_api/
│
├── src/
│ ├── core/ # Lõi của ứng dụng (Domain Logic)
│ │ ├── domain/ # Các entities, value objects
│ │ │ ├── entities/ # Các đối tượng chính
│ │ │ ├── interfaces/ # Các interface chung
│ │ │ └── enums/ # Các enum
│ │ │
│ │ ├── dtos/ # Data Transfer Objects
│ │ ├── exceptions/ # Các ngoại lệ tùy chỉnh
│ │ └── interfaces/ # Ports (Interfaces cho repositories, services)
│ │
│ ├── usecases/ # Các use case của ứng dụng
│ │ ├── user/ # Use cases liên quan đến user
│ │ └── auth/ # Use cases liên quan đến authentication
│ │
│ ├── common/ # Các utility, helper chung
│ │ ├── decorators/ # Custom decorators
│ │ ├── guards/ # Authentication & Authorization guards
│ │ ├── interceptors/ # Request/Response interceptors
│ │ ├── filters/ # Exception filters
│ │ └── utils/ # Utility functions
│ │
│ ├── config/ # Cấu hình ứng dụng
│ │ ├── database.config.ts
│ │ ├── jwt.config.ts
│ │ └── environment.config.ts
│ │
│ ├── infrastructure/ # Các adapter và implementation chi tiết
│ │ ├── adapters/ # Adapters cho external services
│ │ │ ├── repositories/ # Database repositories
│ │ │ └── external-services/ # External service adapters
│ │ │
│ │ └── modules/ # NestJS modules
│ │
│ ├── presentation/ # Controllers và routes
│ │ ├── controllers/ # API controllers
│ │ └── strategies/ # Authentication strategies
│ │
│ ├── app.module.ts # Root module
│ ├── main.ts # Application entry point
│ ├── app.controller.ts # Root controller
│ ├── app.service.ts # Root service
│ └── app.controller.spec.ts # Root controller tests
│
├── migrations/ # Database migrations
├── test/ # Test files
├── scripts/ # Utility scripts
├── dist/ # Compiled code
├── node_modules/ # Dependencies
│
├── .env.development # Development environment variables
├── .gitignore # Git ignore rules
├── package.json # Project dependencies and scripts
├── package-lock.json # Dependency lock file
├── nest-cli.json # NestJS CLI configuration
├── tsconfig.json # TypeScript configuration
├── tsconfig.build.json # TypeScript build configuration
├── .eslintrc.js # ESLint configuration
├── .prettierrc # Prettier configuration
└── README.md # Project documentation
```

````

## Giải Thích Chi Tiết

### 1. Core Layer (`src/core/`)
- Chứa toàn bộ logic nghiệp vụ thuần túy
- Độc lập với framework và cơ sở dữ liệu
- Chỉ phụ thuộc vào các abstraction (interfaces)

### 2. Use Cases (`src/usecases/`)
- Triển khai logic nghiệp vụ cụ thể
- Điều phối giữa các entities và repositories
- Không chứa chi tiết implementation

### 3. Infrastructure Layer (`src/infrastructure/`)
- Cung cấp các implementation cụ thể
- Chứa các adapter kết nối với external services
- Triển khai các port đã được định nghĩa ở core

### 4. Presentation Layer (`src/presentation/`)
- Chứa các controllers
- Xử lý HTTP requests/responses
- Chuyển đổi dữ liệu giữa use cases và client

### 5. Common Layer (`src/common/`)
- Chứa các tiện ích dùng chung
- Guards, Interceptors, Decorators
- Utilities và helper functions

## Nguyên Tắc Chính
- Dependency Rule: Các lớp trong layers trong sẽ không phụ thuộc vào các lớp bên ngoài
- Separation of Concerns
- Dễ dàng thay thế implementation
- Kiểm thử dễ dàng

## Lưu Ý Khi Áp Dụng
1. Luôn ưu tiên interfaces
2. Sử dụng dependency injection
3. Giữ cho core layer thuần túy
4. Minimize dependencies giữa các layers

## Cài Đặt Ban Đầu
```bash
# Cài đặt dependencies
npm install

# Chạy ứng dụng ở chế độ development
npm run start:dev

# Build ứng dụng
npm run build

# Chạy tests
npm run test
````

## Best Practices

- Sử dụng DTO để validate input
- Áp dụng dependency injection
- Sử dụng guards và interceptors
- Viết unit test cho từng layer
