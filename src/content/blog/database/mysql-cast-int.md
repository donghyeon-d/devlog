---
title: "MySQL에서 INT로 CAST하는 방법"
description: "MySQL에서 문자열을 INT 타입으로 변환하는 CAST, CONVERT 사용법과 변환 시 주의해야 할 점을 정리합니다."
date: 2026-09-16
updated: 2026-09-17
category: "Database"
tags:
  - MySQL
  - SQL
draft: false
---

# MySQL에서 INT로 CAST하는 방법

VARCHAR 컬럼에 숫자가 저장되어 있는데 숫자 기준으로 정렬하거나 비교해야 할 때가 있습니다. 이럴 때 MySQL 에서는 `CAST()` 또는 `CONVERT()` 를 사용합니다.

## MySQL CAST란?

`CAST(expr AS type)` 는 값을 지정한 타입으로 변환하는 표준 SQL 함수입니다. MySQL 에서 정수로 변환할 때는 `INT` 가 아니라 **`SIGNED`** 또는 **`UNSIGNED`** 를 사용합니다.

> [!NOTE]
> MySQL 8.0.17 이전 버전에서는 `CAST(x AS INT)` 가 문법 오류입니다. 버전에 상관없이 동작하게 하려면 `SIGNED` 를 사용하세요.

| 변환 타입 | 설명 | 예시 결과 |
|---|---|---:|
| `SIGNED` | 부호 있는 64bit 정수 | `-42` |
| `UNSIGNED` | 부호 없는 64bit 정수 | `42` |
| `DECIMAL(10,2)` | 고정 소수점 | `3.14` |
| `CHAR` | 문자열 | `'42'` |

## INT 변환

### CAST

```sql
-- 문자열을 정수로 변환
SELECT CAST('123' AS SIGNED) AS value;      -- 123
SELECT CAST('  42abc' AS SIGNED) AS value;  -- 42 (경고 발생)
SELECT CAST('abc' AS SIGNED) AS value;      -- 0  (경고 발생)

-- VARCHAR 컬럼을 숫자 기준으로 정렬
SELECT id, version
FROM app_release
ORDER BY CAST(version AS UNSIGNED) DESC
LIMIT 10;
```

### CONVERT

`CONVERT(expr, type)` 는 MySQL 전용 문법이며 결과는 `CAST` 와 같습니다.

```sql
SELECT CONVERT('2026', UNSIGNED) AS year;
```

### 암시적 변환

숫자 연산을 하면 MySQL 이 자동으로 변환하기도 합니다.

```sql
SELECT '10' + 0;   -- 10
SELECT '10' * 1;   -- 10
```

하지만 의도가 코드에 드러나지 않으므로 가능하면 명시적으로 `CAST` 를 사용하는 편이 좋습니다.

## 애플리케이션에서의 처리

PHP 에서 PDO 로 조회하면 숫자 컬럼도 문자열로 넘어오는 경우가 있습니다.

```php
<?php
$stmt = $pdo->prepare('SELECT CAST(score AS SIGNED) AS score FROM ranking WHERE user_id = :id');
$stmt->execute(['id' => $userId]);

$row = $stmt->fetch(PDO::FETCH_ASSOC);
$score = (int) $row['score']; // 드라이버 설정에 따라 문자열일 수 있으므로 한 번 더 캐스팅
```

Java(JDBC) 에서는 `getLong()` 으로 받으면 됩니다.

```java
try (PreparedStatement ps = conn.prepareStatement(
        "SELECT CAST(score AS SIGNED) AS score FROM ranking WHERE user_id = ?")) {
    ps.setLong(1, userId);
    try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) {
            long score = rs.getLong("score");
        }
    }
}
```

## 주의사항

> [!WARNING]
> `WHERE CAST(column AS SIGNED) = 100` 처럼 **컬럼에 함수를 적용하면 인덱스를 사용할 수 없습니다.** 데이터가 많다면 컬럼 타입 자체를 숫자로 바꾸는 것을 검토하세요.

1. 숫자로 시작하지 않는 문자열은 `0` 으로 변환됩니다.
2. 변환에 실패해도 에러가 아니라 **warning** 이 발생합니다. `SHOW WARNINGS;` 로 확인할 수 있습니다.
3. `STRICT_TRANS_TABLES` 모드에서 `INSERT`/`UPDATE` 시에는 에러가 될 수 있습니다.
4. 범위를 넘는 값은 잘리거나(`UNSIGNED`) 음수로 표현될 수 있습니다.

변환 흐름을 그림으로 보면 다음과 같습니다.

![CAST 변환 흐름: 문자열이 SIGNED 정수로 변환되는 과정](/images/posts/mysql/example.png)

## 정리

- [x] 정수 변환은 `CAST(x AS SIGNED)`
- [x] MySQL 전용 문법은 `CONVERT(x, SIGNED)`
- [ ] 자주 비교하는 컬럼이라면 ~~매번 CAST~~ 컬럼 타입 변경을 고려

---

참고: [MySQL 8.0 Reference Manual – Cast Functions and Operators](https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html)
