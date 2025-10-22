package com.example.euro_stueckelung_backend.model;

import java.util.List;

/**
 * Hält das Ergebnis einer Stückelungsberechnung
 * (gesamt in Cent + Liste der verwendeten Scheine/Münzen).
 */
public record Breakdown(
        long totalInCents,
        List<BreakdownItem> items
) {
}