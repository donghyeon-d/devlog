---
title: "Flutter go_router로 라우팅 구성하기"
description: "Flutter 공식 라우팅 패키지 go_router 로 기본 라우팅, 경로 파라미터, 중첩 라우트, 로그인 redirect 를 구성하는 방법을 정리합니다."
date: 2026-08-21
updated: 2026-09-05
category: "Flutter"
tags:
  - Flutter
  - Dart
  - go_router
---

Flutter 의 `Navigator 2.0` API 는 강력하지만 직접 사용하기에는 코드가 많습니다. [go_router](https://pub.dev/packages/go_router) 는 URL 기반으로 라우팅을 선언할 수 있게 해 주는 공식 패키지입니다.

## 설치

```bash
flutter pub add go_router
```

`pubspec.yaml` 에 다음과 같이 추가됩니다.

```yaml
dependencies:
  flutter:
    sdk: flutter
  go_router: ^16.0.0
```

## 기본 라우팅

### 라우터 정의

```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      name: 'home',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/posts/:id',
      name: 'post',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return PostScreen(id: id);
      },
    ),
  ],
);

void main() => runApp(MaterialApp.router(routerConfig: router));
```

### 화면 이동

| 메서드 | 동작 | 뒤로 가기 |
|---|---|---|
| `context.go('/posts/1')` | 스택을 경로에 맞게 교체 | 상위 경로로 이동 |
| `context.push('/posts/1')` | 현재 화면 위에 추가 | 이전 화면으로 이동 |
| `context.goNamed('post', pathParameters: {'id': '1'})` | 이름으로 이동 | 상위 경로로 이동 |

> [!IMPORTANT]
> 웹/딥링크를 고려한다면 `push` 보다 `go` 를 기본으로 사용하는 편이 URL 과 화면 상태를 일치시키기 쉽습니다.

## 쿼리 파라미터

```dart
// /search?q=flutter
GoRoute(
  path: '/search',
  builder: (context, state) {
    final query = state.uri.queryParameters['q'] ?? '';
    return SearchScreen(query: query);
  },
),
```

## 로그인 redirect

인증 상태에 따라 화면을 분기할 때는 `redirect` 를 사용합니다.

```dart
final router = GoRouter(
  refreshListenable: authNotifier,
  redirect: (context, state) {
    final loggedIn = authNotifier.isLoggedIn;
    final goingToLogin = state.matchedLocation == '/login';

    if (!loggedIn && !goingToLogin) return '/login';
    if (loggedIn && goingToLogin) return '/';
    return null; // 그대로 진행
  },
  routes: [/* ... */],
);
```

`refreshListenable` 에 `ChangeNotifier` 를 넘기면 로그인 상태가 바뀔 때 redirect 가 다시 평가됩니다.

## 하단 탭과 ShellRoute

하단 탭처럼 공통 UI 를 유지하면서 내부 화면만 바꾸려면 `StatefulShellRoute` 를 사용합니다.

```dart
StatefulShellRoute.indexedStack(
  builder: (context, state, shell) => ScaffoldWithNavBar(shell: shell),
  branches: [
    StatefulShellBranch(routes: [
      GoRoute(path: '/feed', builder: (_, __) => const FeedScreen()),
    ]),
    StatefulShellBranch(routes: [
      GoRoute(path: '/settings', builder: (_, __) => const SettingsScreen()),
    ]),
  ],
);
```

## 정리

- 경로 파라미터는 `state.pathParameters`, 쿼리는 `state.uri.queryParameters`
- 인증 분기는 `redirect` + `refreshListenable`
- 탭 UI 는 `StatefulShellRoute.indexedStack`
