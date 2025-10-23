package com.example.euro_stueckelung_backend.service;
import com.example.euro_stueckelung_backend.model.Breakdown;
import com.example.euro_stueckelung_backend.model.BreakdownItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

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

    @Test
    @DisplayName("Parst Beträge im String-Format mit Komma korrekt")
    void shouldParseAmountStringWithComma() {
        Breakdown breakdown = denominationService.denominate("45,32");

        assertThat(breakdown.totalInCents()).isEqualTo(4532);
        assertThat(breakdown.items())
                .containsExactly(
                        new BreakdownItem(2000, 2),
                        new BreakdownItem(500, 1),
                        new BreakdownItem(20, 1),
                        new BreakdownItem(10, 1),
                        new BreakdownItem(2, 1)
                );
    }

    @Test
    @DisplayName("Parst Beträge im String-Format mit Punkt korrekt")
    void shouldParseAmountStringWithDot() {
        Breakdown breakdown = denominationService.denominate("12.50");

        assertThat(breakdown.totalInCents()).isEqualTo(1250);
        assertThat(breakdown.items())
                .containsExactly(
                        new BreakdownItem(1000, 1),
                        new BreakdownItem(200, 1),
                        new BreakdownItem(50, 1)
                );
    }

    @Test
    @DisplayName("Gibt für 0 Cent keine Stücke zurück")
    void shouldReturnEmptyBreakdownForZero() {
        Breakdown breakdown = denominationService.denominate(0);

        assertThat(breakdown.totalInCents()).isZero();
        assertThat(breakdown.items()).isEmpty();
    }

    @Test
    @DisplayName("Lehnt negative Cent-Beträge ab")
    void shouldRejectNegativeAmount() {
        assertThatThrownBy(() -> denominationService.denominate(-1))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("nicht negativ");
    }
    
    @Test
    @DisplayName("Lehnt Beträge oberhalb des Limits ab")
    void shouldRejectAmountAboveLimit() {
        assertThatThrownBy(() -> denominationService.denominate(100_000_001L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("zu groß");
    }

    @Test
    @DisplayName("Lehnt ungültige String-Formate ab")
    void shouldRejectInvalidStringAmount() {
        assertThatThrownBy(() -> denominationService.denominate("1,234"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Ungültiges Betragsformat");

        assertThatThrownBy(() -> denominationService.denominate("abc"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Lehnt leere oder null Strings ab")
    void shouldRejectBlankStringAmount() {
        assertThatThrownBy(() -> denominationService.denominate(""))
                .isInstanceOf(IllegalArgumentException.class);

        assertThatThrownBy(() -> denominationService.denominate((String) null))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
