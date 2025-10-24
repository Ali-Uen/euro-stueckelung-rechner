package com.example.euro_stueckelung_backend.dto;

import com.example.euro_stueckelung_backend.model.Breakdown;
import com.example.euro_stueckelung_backend.model.BreakdownItem;
import com.example.euro_stueckelung_backend.model.DiffItem;

import java.util.List;

/**
 * API-Response für die Stückelung.
 */
public record DenominationResponse(
        long totalInCents,
        List<BreakdownItem> items,
        List<DiffItem> diff
) 
{

    public static DenominationResponse from(Breakdown breakdown, List<DiffItem> diff) {
        return new DenominationResponse(breakdown.totalInCents(), breakdown.items(), diff);
    }
}