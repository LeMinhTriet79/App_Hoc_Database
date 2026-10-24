/**
 * FILE: src/data/databases/db-library.js
 * MÔ TẢ: Lược đồ (Schema SQL), Sơ đồ ER ASCII và Dữ liệu mẫu (Seed SQL) cho CSDL: Library (Thư Viện Sách - S ch.5)
 */
window.BIKIP_REGISTRY.registerDatabase({
  "id": "library",
  "name": "Library (Thư Viện Sách - S ch.5)",
  "desc": "Cơ sở dữ liệu thư viện từ sách SQL Notes for Professionals (chương 5). Minh họa rõ quan hệ nhiều-nhiều (n-n) giữa tác giả (Authors) và sách (Books) qua bảng trung gian BooksAuthors.",
  "er_ascii": "+------------------+       +--------------------+       +------------------+\n|     Authors      |       |    BooksAuthors    |       |      Books       |\n+------------------+       +--------------------+       +------------------+\n| PK Id            |<------| FK AuthorId        |------>| PK Id            |\n|    Name          |       | FK BookId          |       |    Title         |\n|    Country       |       +--------------------+       +------------------+\n+------------------+",
  "schema_sql": "CREATE TABLE Authors (\n    Id INT NOT NULL PRIMARY KEY,\n    Name VARCHAR(70) NOT NULL,\n    Country VARCHAR(100) NOT NULL\n);\n\nCREATE TABLE Books (\n    Id INT NOT NULL PRIMARY KEY,\n    Title VARCHAR(50) NOT NULL\n);\n\nCREATE TABLE BooksAuthors (\n    AuthorId INT NOT NULL,\n    BookId INT NOT NULL,\n    FOREIGN KEY (AuthorId) REFERENCES Authors(Id),\n    FOREIGN KEY (BookId) REFERENCES Books(Id)\n);",
  "seed_sql": "INSERT INTO Authors (Id, Name, Country) VALUES\n(1, 'J.D. Salinger', 'USA'),\n(2, 'F. Scott. Fitzgerald', 'USA'),\n(3, 'Jane Austen', 'UK'),\n(4, 'Scott Hanselman', 'USA'),\n(5, 'Jason N. Gaylord', 'USA'),\n(6, 'Pranav Rastogi', 'India'),\n(7, 'Todd Miranda', 'USA'),\n(8, 'Christian Wenz', 'USA'),\n(9, 'Haruki Murakami', 'Japan');\n\nINSERT INTO Books (Id, Title) VALUES\n(1, 'The Catcher in the Rye'),\n(2, 'Nine Stories'),\n(3, 'Franny and Zooey'),\n(4, 'The Great Gatsby'),\n(5, 'Tender id the Night'),\n(6, 'Pride and Prejudice'),\n(7, 'Professional ASP.NET 4.5 in C# and VB'),\n(8, 'Clean Architecture Draft');\n\nINSERT INTO BooksAuthors (BookId, AuthorId) VALUES\n(1, 1),\n(2, 1),\n(3, 1),\n(4, 2),\n(5, 2),\n(6, 3),\n(7, 4),\n(7, 5),\n(7, 6),\n(7, 7),\n(7, 8);"
});
