package com.finance.management.transaction.dto;

import com.finance.management.transaction.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequest(
        @NotBlank String title,
        @NotNull @DecimalMin("0.01") BigDecimal amount,
        @NotNull TransactionType type,
        @NotBlank String category,
        @NotNull LocalDate transactionDate,
        String notes
) {
}
