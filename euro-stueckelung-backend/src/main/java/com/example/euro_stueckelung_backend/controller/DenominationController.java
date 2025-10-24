package com.example.euro_stueckelung_backend.controller;

import com.example.euro_stueckelung_backend.dto.DenominationRequest;
import com.example.euro_stueckelung_backend.dto.DenominationResponse;
import com.example.euro_stueckelung_backend.model.Breakdown;
import com.example.euro_stueckelung_backend.model.BreakdownItem;
import com.example.euro_stueckelung_backend.model.DiffItem;
import com.example.euro_stueckelung_backend.service.DenominationService;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * REST-Einstiegspunkt für die Stückelungsberechnung.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class DenominationController {

    private final DenominationService denominationService;

    public DenominationController(DenominationService denominationService) {
        this.denominationService = denominationService;
    }

    @PostMapping("/denominate")
    public ResponseEntity<DenominationResponse> denominate(@Valid @RequestBody DenominationRequest request) {
        try {
            Breakdown current = request.totalInCents() != null
                ? denominationService.denominate(request.totalInCents())
                : denominationService.denominate(request.amount());

        Breakdown previous = null;                
        if (request.previousBreakdown() != null && !request.previousBreakdown().isEmpty()) {
            List<BreakdownItem> items = request.previousBreakdown().stream()
                    .map(dto -> new BreakdownItem(dto.denominationInCents(), dto.count()))
                    .toList();
            previous = new Breakdown(
                    items.stream().mapToLong(item -> (long) item.denominationInCents() * item.count()).sum(),
                    items
            );
        }

        List<DiffItem> diff = denominationService.computeDiff(previous, current);
            return ResponseEntity.ok(DenominationResponse.from(current, diff));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }
}