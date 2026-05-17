package com.finance.management.transaction.dto;

import com.finance.management.transaction.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionResponse(
        Long id,
        String title,
        BigDecimal amount,
        TransactionType type,
        String category,
        LocalDate transactionDate,
        String notes
) {
}
