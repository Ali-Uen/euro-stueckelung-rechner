package com.example.euro_stueckelung_backend.service;
import com.example.euro_stueckelung_backend.model.Breakdown;
import com.example.euro_stueckelung_backend.model.BreakdownItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DenominationServiceTest {

    private DenominationService denominationService;

    @BeforeEach
    void setUp() {
        denominationService = new DenominationService();
    }

    @Test
    @DisplayName("Greedy-Algorithmus liefert minimale Stückzahl für 234,23 €")
    void shouldComputeOptimalBreakdownFor23423() {
        Breakdown breakdown = denominationService.denominate(23423);

        assertThat(breakdown.totalInCents()).isEqualTo(23423);
        assertThat(breakdown.items())
                .containsExactly(
                        new BreakdownItem(20000, 1),
                        new BreakdownItem(2000, 1),
                        new BreakdownItem(1000, 1),
                        new BreakdownItem(200, 2),
                        new BreakdownItem(20, 1),
                        new BreakdownItem(2, 1),
                        new BreakdownItem(1, 1)
                );
    }
}
