package com.example.euro_stueckelung_backend.controller;

import com.example.euro_stueckelung_backend.dto.DenominationRequest;
import com.example.euro_stueckelung_backend.dto.DenominationResponse;
import com.example.euro_stueckelung_backend.model.Breakdown;
import com.example.euro_stueckelung_backend.service.DenominationService;
import jakarta.validation.Valid;
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
            Breakdown breakdown;
            if (request.totalInCents() != null) {
                breakdown = denominationService.denominate(request.totalInCents());
            } else {
                breakdown = denominationService.denominate(request.amount());
            }
            return ResponseEntity.ok(DenominationResponse.from(breakdown));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }
}