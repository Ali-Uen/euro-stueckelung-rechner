package com.example.euro_stueckelung_backend.service;

import com.example.euro_stueckelung_backend.model.Breakdown;
import com.example.euro_stueckelung_backend.model.BreakdownItem;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Zentrale Domänenlogik für die Berechnung der Euro-Stückelung.
 * <p>
 * Die Implementierung nutzt den bekannten Greedy-Ansatz, der für das
 * Euro-Währungssystem immer die minimale Anzahl an Scheinen/Münzen liefert.
 */
@Service
public class DenominationService {

    private static final int[] EURO_DENOMINATIONS = {
            20000, 10000, 5000, 2000, 1000,
            500, 200, 100, 50, 20,
            10, 5, 2, 1
    };

    private static final Pattern AMOUNT_PATTERN = Pattern.compile("^\\d+(?:[.,]\\d{1,2})?$");
    private static final long MAX_SUPPORTED_AMOUNT_IN_CENTS = 100_000_000L; // 1 Mio. Euro

    /**
     * Wandelt einen Betrag (String, z. B. "234,23") in Cent um und führt die Stückelung aus.
     *
     * @param amount Eingabetext
     * @return Breakdown mit Stückelung
     */
    public Breakdown denominate(String amount) {
        long cents = parseAmountToCents(amount);
        return denominate(cents);
    }

    /**
     * Berechnet die Stückelung für einen bereits in Cent vorliegenden Betrag.
     *
     * @param totalInCents Betrag in Cent
     * @return Breakdown mit Stückelung
     */
    public Breakdown denominate(long totalInCents) {
        validateAmount(totalInCents);

        long remaining = totalInCents;
        List<BreakdownItem> items = new ArrayList<>();

        for (int denomination : EURO_DENOMINATIONS) {
            if (remaining == 0) {
                break;
            }

            int count = (int) (remaining / denomination);
            if (count > 0) {
                items.add(new BreakdownItem(denomination, count));
                remaining -= (long) count * denomination;
            }
        }

        return new Breakdown(totalInCents, items);
    }

    private long parseAmountToCents(String amount) {
        if (amount == null || amount.isBlank()) {
            throw new IllegalArgumentException("Betrag darf nicht leer sein.");
        }

        String normalized = amount.trim().replace(',', '.');
        if (!AMOUNT_PATTERN.matcher(normalized).matches()) {
            throw new IllegalArgumentException("Ungültiges Betragsformat.");
        }

        String[] parts = normalized.split("\\.");
        long euroPart = Long.parseLong(parts[0]);
        int centPart = parts.length == 2 ? Integer.parseInt((parts[1] + "00").substring(0, 2)) : 0;

        long result = euroPart * 100 + centPart;
        validateAmount(result);
        return result;
    }

    private void validateAmount(long totalInCents) {
        if (totalInCents < 0) {
            throw new IllegalArgumentException("Betrag darf nicht negativ sein.");
        }
        if (totalInCents > MAX_SUPPORTED_AMOUNT_IN_CENTS) {
            throw new IllegalArgumentException("Betrag ist zu groß.");
        }
    }
}