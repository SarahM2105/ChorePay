package com.chorepay.backend.chore;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "chore_checklist_items")
public class ChoreChecklistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chore_template_id", nullable = false)
    private ChoreTemplate choreTemplate;

    @Column(nullable = false, length = 255)
    private String text;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Column(nullable = false)
    private boolean required = true;

    public ChoreChecklistItem() {
    }

    public UUID getId() {
        return id;
    }

    public ChoreTemplate getChoreTemplate() {
        return choreTemplate;
    }

    public void setChoreTemplate(ChoreTemplate choreTemplate) {
        this.choreTemplate = choreTemplate;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }
}