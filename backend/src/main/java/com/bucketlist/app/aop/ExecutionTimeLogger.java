package com.bucketlist.app.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Aspect
@Component
public class ExecutionTimeLogger {

    // com.bucketlist.app.controller 패키지 이하의 모든 메서드 실행 시 동작
    @Around("execution(* com.bucketlist.app.controller..*(..))")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        // 메서드 실행 시작 시간 기록
        long startTime = System.currentTimeMillis();
        
        // 실제 대상 메서드 실행
        Object result = joinPoint.proceed();

        // 메서드 실행 종료 시간 기록
        long endTime = System.currentTimeMillis();

        // 실행 시간 로그 출력
        log.info("[{}] 실행 시간: {}ms", joinPoint.getSignature(), (endTime - startTime));
        return result;
    }
}
