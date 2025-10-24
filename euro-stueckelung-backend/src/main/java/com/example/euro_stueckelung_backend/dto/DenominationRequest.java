package com.example.euro_stueckelung_backend.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

/**
 * Repräsentiert den Request-Body des Denomination-Endpunkts.
 * Entweder {@code amount} (als String) oder {@code totalInCents} muss gesetzt sein.
 */
public record DenominationRequest(
        @Pattern(regexp = "^\\d+(?:[.,]\\d{1,2})?$", message = "Ungültiges Betragsformat.")
        String amount,

        @PositiveOrZero(message = "Der Betrag darf nicht negativ sein.")
        Long totalInCents,
        
        @Valid
        @Size(max = 20, message = "Zu viele Einträge im vorherigen Breakdown.")
        List<BreakdownDto> previousBreakdown
) {

    @AssertTrue(message = "Es muss entweder amount oder totalInCents angegeben werden.")
    public boolean hasValidInput() {
        boolean hasAmount = amount != null && !amount.isBlank();
        boolean hasCents = totalInCents != null;
        return hasAmount || hasCents;
    }
}