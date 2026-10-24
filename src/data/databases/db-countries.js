/**
 * FILE: src/data/databases/db-countries.js
 * MÔ TẢ: Lược đồ (Schema SQL), Sơ đồ ER ASCII và Dữ liệu mẫu (Seed SQL) cho CSDL: Countries (Quốc Gia & Thành Phố - S ch.5)
 */
window.BIKIP_REGISTRY.registerDatabase({
  "id": "countries",
  "name": "Countries (Quốc Gia & Thành Phố - S ch.5)",
  "desc": "Cơ sở dữ liệu địa lý đơn giản từ chương 5 của sách SQL Notes, rất tiện để thử nghiệm INNER JOIN, LEFT JOIN, CROSS JOIN và lọc tập hợp.",
  "er_ascii": "+------------------+       +--------------------+\n|    Countries     |       |       Cities       |\n+------------------+       +--------------------+\n| PK Id            |<------| PK Id              |\n|    Name          |       | FK CountryId       |\n+------------------+       |    Name            |\n                           +--------------------+",
  "schema_sql": "CREATE TABLE Countries (\n    Id INT NOT NULL PRIMARY KEY,\n    Name VARCHAR(50) NOT NULL\n);\n\nCREATE TABLE Cities (\n    Id INT NOT NULL PRIMARY KEY,\n    CountryId INT NOT NULL,\n    Name VARCHAR(50) NOT NULL,\n    FOREIGN KEY (CountryId) REFERENCES Countries(Id)\n);",
  "seed_sql": "INSERT INTO Countries (Id, Name) VALUES\n(1, 'Russian Federation'),\n(2, 'Germany'),\n(3, 'United States'),\n(4, 'Spain'),\n(5, 'Vietnam');\n\nINSERT INTO Cities (Id, CountryId, Name) VALUES\n(1, 1, 'Moscow'),\n(2, 1, 'Saint Petersburg'),\n(3, 1, 'Omsk'),\n(4, 2, 'Berlin'),\n(5, 2, 'Frankfurt'),\n(6, 3, 'New York'),\n(7, 3, 'Los Angeles'),\n(8, 3, 'Chicago'),\n(9, 5, 'Ha Noi'),\n(10, 5, 'TP Ho Chi Minh');"
});
