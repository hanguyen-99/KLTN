package com.document.manager.dto.enums;

public enum PlagiarismStatus {
    SAME("Same"),
    SIMILAR("Similar"),
    DIFFERENT("Different");

    private final String description;

    PlagiarismStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
