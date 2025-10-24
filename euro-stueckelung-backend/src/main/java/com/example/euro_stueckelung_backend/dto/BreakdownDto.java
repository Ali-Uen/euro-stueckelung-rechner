package com.example.euro_stueckelung_backend.dto;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record BreakdownDto(
    @Positive(message = "Denomination muss positiv sein.") int denominationInCents,
    @PositiveOrZero(message = "Anzahl darf nicht negativ sein.") int count
) {}