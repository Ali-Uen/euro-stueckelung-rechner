package com.example.euro_stueckelung_backend.model;

/**
 * Einzelner Eintrag: Denomination (in Cent) und Stückzahl.
 */
public record BreakdownItem(
        int denominationInCents,
        int count
) {
}