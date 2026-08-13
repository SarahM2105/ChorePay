package com.chorepay.backend.chore;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(
        name = "chore_submission_checklist_items",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_submission_checklist_item",
                        columnNames = {
                                "submission_id",
                                "checklist_item_id"
                        }
                )
        }
)
public class ChoreSubmissionChecklistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "submission_id", nullable = false)
    private ChoreSubmission submission;

    @Column(name = "checklist_item_id", nullable = false)
private UUID checklistItemId;

    /*
     * Snapshot fields preserve what the checklist looked
     * like when this submission was made.
     */
    @Column(name = "text_snapshot", nullable = false, length = 255)
    private String textSnapshot;
    

    @Column(name = "required_snapshot", nullable = false)
    private boolean requiredSnapshot;

    @Column(nullable = false)
    private boolean completed;

    public ChoreSubmissionChecklistItem() {
    }

    public UUID getId() {
        return id;
    }

    public ChoreSubmission getSubmission() {
        return submission;
    }

    public void setSubmission(
            ChoreSubmission submission
    ) {
        this.submission = submission;
    }

   public UUID getChecklistItemId() {
    return checklistItemId;
}

public void setChecklistItemId(UUID checklistItemId) {
    this.checklistItemId = checklistItemId;
}

    public String getTextSnapshot() {
        return textSnapshot;
    }

    public void setTextSnapshot(
            String textSnapshot
    ) {
        this.textSnapshot = textSnapshot;
    }

    public boolean isRequiredSnapshot() {
        return requiredSnapshot;
    }

    public void setRequiredSnapshot(
            boolean requiredSnapshot
    ) {
        this.requiredSnapshot = requiredSnapshot;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}