-- =========================================================================
-- DATABASE: FRUITSTORE ULTIMATE (CHUẨN ENTERPRISE)
-- Tích hợp sẵn: Hierarchy (CTE), JSON, Computed Columns, Mảng Dữ liệu Lớn
-- =========================================================================

USE master;
GO

IF DB_ID('FruitStore_Ultimate') IS NULL
BEGIN
    CREATE DATABASE FruitStore_Ultimate;
END
GO

USE FruitStore_Ultimate;
GO

-- =========================================================================
-- 1. DỌN DẸP BẢNG CŨ (DROP THEO THỨ TỰ RÀNG BUỘC)
-- =========================================================================
DROP TABLE IF EXISTS PaymentTransactions;
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS OrderDetails;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Vouchers;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Fruits;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Employees;
GO

-- =========================================================================
-- 2. TẠO BẢNG (SCHEMA DEFINITION)
-- =========================================================================

-- Bảng Nhân viên (Tự tham chiếu ManagerID để luyện Recursive CTE)
CREATE TABLE Employees (
    EmployeeID INT IDENTITY(1,1) CONSTRAINT PK_Employees PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Role NVARCHAR(50) NOT NULL,
    ManagerID INT NULL CONSTRAINT FK_Employees_Manager FOREIGN KEY REFERENCES Employees(EmployeeID),
    HireDate DATETIME2(0) CONSTRAINT DF_Employees_HireDate DEFAULT SYSDATETIME(),
    IsActive BIT CONSTRAINT DF_Employees_IsActive DEFAULT 1
);

-- Bảng Danh mục
CREATE TABLE Categories (
    CategoryID INT IDENTITY(1,1) CONSTRAINT PK_Categories PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255) NULL
);

-- Bảng Sản phẩm (Có cột JSON để luyện hàm OPENJSON)
CREATE TABLE Fruits (
    FruitID INT IDENTITY(1,1) CONSTRAINT PK_Fruits PRIMARY KEY,
    CategoryID INT NOT NULL CONSTRAINT FK_Fruits_Categories FOREIGN KEY REFERENCES Categories(CategoryID),
    FruitName NVARCHAR(100) NOT NULL,
    Price DECIMAL(18, 2) NOT NULL CONSTRAINT CK_Fruits_Price CHECK (Price >= 0),
    StockQuantity INT NOT NULL CONSTRAINT CK_Fruits_Stock CHECK (StockQuantity >= 0),
    Unit NVARCHAR(20) CONSTRAINT DF_Fruits_Unit DEFAULT N'Kg',
    Origin NVARCHAR(100) NULL,
    AttributesJSON NVARCHAR(MAX) NULL CONSTRAINT CK_Fruits_JSON CHECK (AttributesJSON IS NULL OR ISJSON(AttributesJSON) > 0),
    IsActive BIT CONSTRAINT DF_Fruits_IsActive DEFAULT 1
);

-- Bảng Khách hàng
CREATE TABLE Customers (
    CustomerID INT IDENTITY(1,1) CONSTRAINT PK_Customers PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(20) CONSTRAINT UQ_Customers_Phone UNIQUE NOT NULL,
    Address NVARCHAR(255) NULL,
    CustomerType NVARCHAR(20) CONSTRAINT DF_Customers_Type DEFAULT N'Standard', -- Standard, VIP
    RegisterDate DATETIME2(0) CONSTRAINT DF_Customers_RegDate DEFAULT SYSDATETIME()
);

-- Bảng Voucher
CREATE TABLE Vouchers (
    VoucherID INT IDENTITY(1,1) CONSTRAINT PK_Vouchers PRIMARY KEY,
    VoucherCode VARCHAR(50) CONSTRAINT UQ_Vouchers_Code UNIQUE NOT NULL,
    DiscountAmount DECIMAL(18, 2) NOT NULL,
    MinOrderValue DECIMAL(18, 2) NOT NULL CONSTRAINT DF_Vouchers_MinOrder DEFAULT 0,
    UsageLimit INT NOT NULL,
    UsedCount INT NOT NULL CONSTRAINT DF_Vouchers_UsedCount DEFAULT 0,
    ExpiryDate DATETIME2(0) NOT NULL,
    CONSTRAINT CK_Vouchers_Usage CHECK (UsedCount <= UsageLimit)
);

-- Bảng Đơn hàng
CREATE TABLE Orders (
    OrderID INT IDENTITY(1,1) CONSTRAINT PK_Orders PRIMARY KEY,
    CustomerID INT NOT NULL CONSTRAINT FK_Orders_Customers FOREIGN KEY REFERENCES Customers(CustomerID),
    EmployeeID INT NOT NULL CONSTRAINT FK_Orders_Employees FOREIGN KEY REFERENCES Employees(EmployeeID),
    VoucherID INT NULL CONSTRAINT FK_Orders_Vouchers FOREIGN KEY REFERENCES Vouchers(VoucherID),
    OrderDate DATETIME2(0) CONSTRAINT DF_Orders_OrderDate DEFAULT SYSDATETIME(),
    TotalAmount DECIMAL(18, 2) NOT NULL CONSTRAINT DF_Orders_Total DEFAULT 0,
    Status NVARCHAR(50) CONSTRAINT DF_Orders_Status DEFAULT N'Chờ xử lý' -- Chờ xử lý, Đã giao, Đã hủy
);

-- Bảng Chi tiết Đơn hàng (Dùng Computed Column PERSISTED)
CREATE TABLE OrderDetails (
    OrderDetailID INT IDENTITY(1,1) CONSTRAINT PK_OrderDetails PRIMARY KEY,
    OrderID INT NOT NULL CONSTRAINT FK_OrderDetails_Orders FOREIGN KEY REFERENCES Orders(OrderID) ON DELETE CASCADE,
    FruitID INT NOT NULL CONSTRAINT FK_OrderDetails_Fruits FOREIGN KEY REFERENCES Fruits(FruitID),
    Quantity INT NOT NULL CONSTRAINT CK_OrderDetails_Qty CHECK (Quantity > 0),
    UnitPrice DECIMAL(18, 2) NOT NULL,
    SubTotal AS (CAST(Quantity * UnitPrice AS DECIMAL(18, 2))) PERSISTED
);

-- Bảng Đánh giá
CREATE TABLE Reviews (
    ReviewID INT IDENTITY(1,1) CONSTRAINT PK_Reviews PRIMARY KEY,
    CustomerID INT NOT NULL CONSTRAINT FK_Reviews_Customers FOREIGN KEY REFERENCES Customers(CustomerID),
    FruitID INT NOT NULL CONSTRAINT FK_Reviews_Fruits FOREIGN KEY REFERENCES Fruits(FruitID),
    Rating INT NOT NULL CONSTRAINT CK_Reviews_Rating CHECK (Rating BETWEEN 1 AND 5),
    Comment NVARCHAR(500) NULL,
    ReviewDate DATETIME2(0) CONSTRAINT DF_Reviews_Date DEFAULT SYSDATETIME()
);

-- Bảng Thanh toán
CREATE TABLE PaymentTransactions (
    TransactionID INT IDENTITY(1,1) CONSTRAINT PK_PaymentTransactions PRIMARY KEY,
    OrderID INT NOT NULL CONSTRAINT FK_Payments_Orders FOREIGN KEY REFERENCES Orders(OrderID),
    PaymentMethod NVARCHAR(50) NOT NULL, -- Tiền mặt, VNPAY, Momo
    Amount DECIMAL(18, 2) NOT NULL,
    PaymentDate DATETIME2(0) CONSTRAINT DF_Payments_Date DEFAULT SYSDATETIME()
);
GO

-- =========================================================================
-- 3. ĐỔ DỮ LIỆU MẪU (MULTI-ROW INSERTS)
-- =========================================================================

-- 3.1. Employees (1 Giám đốc -> 2 Quản lý -> 4 Nhân viên)
INSERT INTO Employees (FullName, Role, ManagerID, HireDate) VALUES 
(N'Lê Minh Triết', N'Giám đốc', NULL, '2020-01-01'),           -- ID: 1
(N'Nguyễn Tấn Dũng', N'Quản lý Kho', 1, '2021-03-15'),         -- ID: 2
(N'Trần Thị Mỹ Tiên', N'Quản lý Bán hàng', 1, '2021-04-10'),       -- ID: 3
(N'Phạm Võ Khải Anh', N'Nhân viên Kho', 2, '2022-01-20'),            -- ID: 4
(N'Nguyễn Sỹ Còi', N'Nhân viên Kho', 2, '2023-05-12'),               -- ID: 5
(N'Nguyễn Tuấn Thanh', N'Nhân viên Bán hàng', 3, '2022-11-05'),        -- ID: 6
(N'Nguyễn Minh Trung', N'Nhân viên Bán hàng', 3, '2023-08-30');         -- ID: 7

-- 3.2. Categories
INSERT INTO Categories (CategoryName, Description) VALUES
(N'Đặc sản Miền Tây', N'Trái cây hái tại vườn ĐBSCL'),
(N'Trái cây Nhập khẩu', N'Táo, Nho, Cherry từ Mỹ, Úc, Nhật'),
(N'Quả mọng (Berries)', N'Dâu tây, Việt quất, Mâm xôi'),
(N'Trái cây sấy', N'Đã qua chế biến khô'),
(N'Quả hạch (Nuts)', N'Mắc ca, Hạnh nhân, Óc chó');

-- 3.3. Fruits (Kèm dữ liệu JSON siêu thực tế)
INSERT INTO Fruits (CategoryID, FruitName, Price, StockQuantity, Unit, Origin, AttributesJSON) VALUES
(1, N'Sầu Riêng Ri6', 150000, 50, N'Kg', N'Bến Tre', N'{"Taste":"Sweet", "SugarLevel": "High", "Color":"Yellow"}'),
(1, N'Bưởi Da Xanh', 70000, 120, N'Quả', N'Bến Tre', N'{"Taste":"Sour", "Vitamins":["C", "A"], "Color":"Green"}'),
(1, N'Xoài Cát Hòa Lộc', 80000, 200, N'Kg', N'Tiền Giang', N'{"Taste":"Sweet", "SugarLevel": "High", "Season":"Summer"}'),
(1, N'Măng Cụt Lái Thiêu', 95000, 80, N'Kg', N'Bình Dương', N'{"Taste":"Sweet-Sour", "Color":"Purple"}'),
(2, N'Nho Mẫu Đơn Shine Muscat', 850000, 15, N'Chùm', N'Hàn Quốc', N'{"Taste":"Very Sweet", "Vitamins":["C", "K"], "Seedless":true}'),
(2, N'Táo Envy', 250000, 100, N'Kg', N'Mỹ', N'{"Taste":"Crisp Sweet", "Size":"Large", "Color":"Red"}'),
(2, N'Cherry Đỏ Thẫm', 450000, 30, N'Kg', N'Úc', N'{"Taste":"Sweet", "Color":"Dark Red"}'),
(2, N'Kiwi Vàng', 180000, 60, N'Hộp', N'New Zealand', N'{"Taste":"Sweet-Sour", "Vitamins":["C"], "Seedless":true}'),
(3, N'Dâu Tây Mộc Châu', 200000, 45, N'Hộp', N'Sơn La', N'{"Taste":"Sour", "Color":"Red"}'),
(3, N'Việt Quất (Blueberry)', 350000, 20, N'Hộp', N'Mỹ', N'{"Taste":"Sweet-Sour", "Antioxidants":"High"}'),
(3, N'Mâm Xôi Đen', 320000, 0, N'Hộp', N'Đà Lạt', N'{"Taste":"Sour", "StockStatus":"Out"}'), -- Cố tình set Stock = 0
(4, N'Nho khô Ninh Thuận', 120000, 300, N'Hũ', N'Ninh Thuận', NULL),
(4, N'Mít sấy giòn', 60000, 150, N'Bịch', N'Đồng Nai', NULL),
(5, N'Hạt Mắc Ca', 280000, 90, N'Hũ', N'Đắk Lắk', N'{"Taste":"Rich", "Fat":"High"}');

-- 3.4. Customers (Có khách mua nhiều, khách chưa mua)
INSERT INTO Customers (FullName, PhoneNumber, Address, CustomerType, RegisterDate) VALUES
(N'Võ Thành Tài', '0901111222', N'Quận 1, TP.HCM', N'VIP', '2023-01-15'),
(N'Nguyễn Thị Lệ', '0902222333', N'Ninh Kiều, Cần Thơ', N'Standard', '2023-03-20'),
(N'Trương Vô Kỵ', '0903333444', N'Biên Hòa, Đồng Nai', N'Standard', '2023-05-10'),
(N'Triệu Mẫn', '0904444555', N'Quận 7, TP.HCM', N'VIP', '2023-07-22'),
(N'Chu Chỉ Nhược', '0905555666', N'Đà Lạt, Lâm Đồng', N'Standard', '2023-11-11'),
(N'Ân Ly', '0906666777', N'Hà Nội', N'Standard', '2024-01-05'),
(N'Tiểu Chiêu', '0907777888', N'Đà Nẵng', N'Standard', '2024-02-14'),
(N'Dương Quá', '0908888999', N'Tuy Hòa, Phú Yên', N'Standard', '2024-03-10'); -- Khách này chưa mua đơn nào

-- 3.5. Vouchers
INSERT INTO Vouchers (VoucherCode, DiscountAmount, MinOrderValue, UsageLimit, UsedCount, ExpiryDate) VALUES
('WELCOME50', 50000, 200000, 1000, 250, '2025-12-31'),
('VIP100', 100000, 500000, 100, 5, '2025-12-31'),
('HETHAN', 30000, 100000, 500, 500, '2023-12-31'); -- Cố tình tạo Voucher hết hạn và hết lượt

-- 3.6. Orders (Rải rác các tháng để luyện GROUP BY MONTH)
INSERT INTO Orders (CustomerID, EmployeeID, VoucherID, OrderDate, TotalAmount, Status) VALUES
(1, 6, NULL, '2023-02-14 10:15:00', 850000, N'Đã giao'),
(2, 6, 1, '2023-04-20 14:30:00', 250000, N'Đã giao'),
(3, 7, NULL, '2023-06-15 09:00:00', 150000, N'Đã giao'),
(4, 7, 2, '2023-08-08 16:45:00', 1150000, N'Đã giao'),
(1, 6, 2, '2023-12-24 19:00:00', 1700000, N'Đã giao'),
(5, 7, 1, '2024-01-10 08:30:00', 350000, N'Đã giao'),
(6, 6, NULL, '2024-02-14 11:20:00', 180000, N'Đã hủy'),
(1, 6, NULL, '2024-03-01 15:10:00', 200000, N'Đang giao'),
(4, 7, 1, '2024-03-05 10:00:00', 450000, N'Chờ xử lý'),
(7, 6, NULL, '2024-03-10 14:00:00', 95000, N'Chờ xử lý');

-- 3.7. OrderDetails (Chi tiết các mặt hàng trong đơn)
INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) VALUES
(1, 5, 1, 850000),             -- Đơn 1: 1 Nho Mẫu Đơn
(2, 3, 2, 80000),              -- Đơn 2: 2kg Xoài, 1 quả Bưởi
(2, 2, 1, 70000),
(3, 1, 1, 150000),             -- Đơn 3: 1kg Sầu Riêng
(4, 6, 2, 250000),             -- Đơn 4: 2kg Táo Envy, 1kg Cherry
(4, 7, 1, 450000),
(5, 5, 2, 850000),             -- Đơn 5 (Khách VIP mua sỉ): 2 Nho Mẫu Đơn, 2 Cherry
(5, 7, 2, 450000),
(6, 10, 1, 350000),            -- Đơn 6: 1 Hộp Việt Quất
(7, 8, 1, 180000),             -- Đơn 7 (Bị hủy): 1 Kiwi Vàng
(8, 9, 1, 200000),             -- Đơn 8: 1 Dâu Tây
(9, 7, 1, 450000),             -- Đơn 9: 1 Cherry
(10, 4, 1, 95000);             -- Đơn 10: 1 Măng Cụt

-- 3.8. Cập nhật lại TotalAmount cho Orders sau khi có OrderDetails (Dùng CTE để UPDATE)
WITH OrderTotals AS (
    SELECT OrderID, SUM(SubTotal) AS ActualTotal
    FROM OrderDetails
    GROUP BY OrderID
)
UPDATE o
SET o.TotalAmount = ot.ActualTotal - ISNULL(v.DiscountAmount, 0)
FROM Orders o
INNER JOIN OrderTotals ot ON o.OrderID = ot.OrderID
LEFT JOIN Vouchers v ON o.VoucherID = v.VoucherID;

-- 3.9. Reviews
INSERT INTO Reviews (CustomerID, FruitID, Rating, Comment, ReviewDate) VALUES
(1, 5, 5, N'Nho rất giòn và ngọt, đáng tiền!', '2023-02-16 09:00:00'),
(2, 3, 4, N'Xoài ngọt nhưng da hơi xấu', '2023-04-22 15:30:00'),
(4, 6, 5, N'Táo Envy chuẩn Mỹ, rất thơm.', '2023-08-10 20:15:00'),
(5, 10, 3, N'Việt quất hơi chua so với mong đợi.', '2024-01-12 11:00:00');

-- 3.10. PaymentTransactions
INSERT INTO PaymentTransactions (OrderID, PaymentMethod, Amount, PaymentDate) VALUES
(1, N'VNPAY', 850000, '2023-02-14 10:16:00'),
(2, N'Tiền mặt', 200000, '2023-04-20 14:30:00'), -- Tổng 230k - Voucher 50k = 180k (Khách đưa 200k)
(3, N'Momo', 150000, '2023-06-15 09:02:00'),
(4, N'VNPAY', 850000, '2023-08-08 16:47:00'),    -- Tổng 950k - Voucher 100k = 850k
(5, N'VNPAY', 2500000, '2023-12-24 19:05:00'),   -- Tổng 2600k - Voucher 100k = 2500k
(6, N'Momo', 300000, '2024-01-10 08:35:00');     -- Tổng 350k - Voucher 50k = 300k
GO

PRINT N'=== ĐÃ TẠO VÀ NẠP DỮ LIỆU THÀNH CÔNG CHO FRUITSTORE_ULTIMATE ===';