package com.example.euro_stueckelung_backend.controller;

import com.example.euro_stueckelung_backend.model.DiffItem;
import com.example.euro_stueckelung_backend.model.Breakdown;
import com.example.euro_stueckelung_backend.model.BreakdownItem;
import com.example.euro_stueckelung_backend.service.DenominationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DenominationController.class)
class DenominationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DenominationService denominationService;

    @Test
    @DisplayName("Liefert Breakdown-Response für gültigen Cent-Betrag inklusive Diff")
    void shouldReturnBreakdownForValidRequest() throws Exception {
        Breakdown breakdown = new Breakdown(23423,
                List.of(new BreakdownItem(20000, 1),
                        new BreakdownItem(2000, 1)));
        List<DiffItem> diff = List.of(
        new DiffItem(20000, 1),
        new DiffItem(2000, 1)
        );
        when(denominationService.denominate(23423L)).thenReturn(breakdown);
        when(denominationService.computeDiff(null, breakdown)).thenReturn(diff);

        mockMvc.perform(post("/api/denominate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"totalInCents":23423}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalInCents").value(23423))
                .andExpect(jsonPath("$.items[0].denominationInCents").value(20000))
                .andExpect(jsonPath("$.items[0].count").value(1))
                .andExpect(jsonPath("$.diff[0].denominationInCents").value(20000))
                .andExpect(jsonPath("$.diff[0].delta").value(1))
                .andExpect(jsonPath("$.diff[1].denominationInCents").value(2000))
                .andExpect(jsonPath("$.diff[1].delta").value(1));
    }

    @Test
    @DisplayName("Gibt 400 zurück, wenn weder amount noch totalInCents gesetzt ist")
    void shouldReturnBadRequestWhenBodyInvalid() throws Exception {
        mockMvc.perform(post("/api/denominate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Übersetzt IllegalArgumentException des Service in HTTP 400")
    void shouldTranslateIllegalArgumentException() throws Exception {
        when(denominationService.denominate(anyLong()))
                .thenThrow(new IllegalArgumentException("Betrag ist zu groß."));

        mockMvc.perform(post("/api/denominate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"totalInCents":100000001}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(status().reason(containsString("Betrag ist zu groß")));
    }
}
