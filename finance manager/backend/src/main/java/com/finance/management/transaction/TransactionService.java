package com.finance.management.transaction;

import com.finance.management.transaction.dto.TransactionRequest;
import com.finance.management.transaction.dto.TransactionResponse;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<TransactionResponse> findAll() {
        return transactionRepository.findAll(Sort.by(Sort.Direction.DESC, "transactionDate", "id"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TransactionResponse create(TransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setTitle(request.title());
        transaction.setAmount(request.amount());
        transaction.setType(request.type());
        transaction.setCategory(request.category());
        transaction.setTransactionDate(request.transactionDate());
        transaction.setNotes(request.notes());

        return toResponse(transactionRepository.save(transaction));
    }

    public void delete(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new EntityNotFoundException("Transaction not found");
        }
        transactionRepository.deleteById(id);
    }

    private TransactionResponse toResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getTitle(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getCategory(),
                transaction.getTransactionDate(),
                transaction.getNotes()
        );
    }
}
