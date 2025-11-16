# Language Learning Tool - Feature Roadmap

This document outlines the planned features and improvements for the Language Learning Tool. Each section provides context and requirements that can be used as a reference for implementation.

---

## High Priority / MVP Features

### 1. Robust Grading System
**Status:** TODO
**Priority:** High

**Problem:**
Currently, the grading system relies on string and array comparisons declared in random places throughout the codebase, which creates maintainability issues and potential bugs.

**Requirements:**
- Centralize grading logic into a dedicated system/module
- Create consistent grading criteria and validation
- Remove scattered string/array comparisons
- Implement a structured approach to essay evaluation
- Ensure scalability and maintainability

---

### 2. Dictionary Integration on Add Words Page
**Status:** TODO
**Priority:** High

**Requirements:**
- Add dictionary lookup functionality to the "Add Words" page
- Clean up and improve the styling of the page
- Provide word definitions, translations, or related data when adding words
- Improve UX for word entry workflow

---

### 3. Tutor Student Management Page
**Status:** TODO
**Priority:** High

**Requirements:**
- Create a "Student Page" for tutors to view their students
- Display student information, progress, and submitted essays
- Enable tutors to make changes to essays after grading
- Provide ability to re-grade or edit feedback
- Track student-tutor relationships

---

### 4. Bucket Dashboard Improvements
**Status:** TODO
**Priority:** Medium

**Requirements:**
- Remove unused filters or fix existing ones
- Specifically address "unused" and "waiting for grade" filters
- Clean up dashboard UI/UX
- Ensure all displayed data is relevant and functional

---

### 5. Custom Dictionary Comments
**Status:** TODO
**Priority:** Medium

**Requirements:**
- Allow users to add custom comments to dictionary entries
- Enable tutors to add comments visible to their students
- Create student-specific dictionary feature
- Implement comment visibility controls (private vs. shared)

---

### 6. Essay Page for Students
**Status:** TODO
**Priority:** Medium

**Requirements:**
- Create dedicated "Essay Page" for students when they receive marked essays
- Provide option to make essays public
- Display grading feedback and corrections
- Enable essay sharing functionality

---

### 7. Enhanced Word Details in Bucket Dashboard
**Status:** TODO
**Priority:** Medium

**Requirements:**
- Clicking on a word should show detailed information modal/page
- Display dictionary data for the word
- Show all essays where the word has been used
- Display comments from essays containing the word
- Show context: 30 characters before and after word usage in essays
- Improve essay styling with additional metadata

---

### 8. Prevent Duplicate Words in Database
**Status:** TODO
**Priority:** High

**Problem:**
Currently, the same word is stored multiple times in the database for different users, leading to data redundancy.

**Solution:**
- Create a single centralized `words` table
- When users add a word to their bucket, reference the existing word entry
- Use pivot tables to manage user-word relationships
- Ensure only one entry per word (e.g., only one "analyze" entry in database)
- Reduce storage redundancy and improve data consistency

---

### 9. Tutor-Student Connection System
**Status:** TODO
**Priority:** Medium

**Requirements:**
- Add ability for tutors and students to connect with each other
- Implement invitation/request system
- Manage tutor-student relationships
- Handle acceptance/rejection of connection requests

---

### 10. Essay Submission Notes
**Status:** TODO
**Priority:** Low

**Requirements:**
- Add a note field on the "Write Essay" page
- Allow students to include notes for tutors with their essay submissions
- Display these notes to tutors during grading

---

### 11. Previously Graded Essays for Tutors
**Status:** TODO
**Priority:** Medium

**Requirements:**
- Create a page for tutors to view previously graded essays
- Enable filtering and searching of past graded work
- Provide quick access to student history

---

### 12. Code Privacy Considerations
**Status:** TODO
**Priority:** Low

**Consideration:**
- Evaluate making repository private
- Create comprehensive public-facing documentation page about the project
- Balance open-source benefits with privacy concerns

---

### 13. Design & UX Improvements
**Status:** TODO
**Priority:** Ongoing

**Requirements:**
- General design improvements across the application
- Enhance user experience throughout
- Address specific UX pain points as they arise

---

## Not MVP / Future Features

### 14. Multi-Reviewer Essay System
**Status:** Future
**Priority:** Low

**Requirements:**
- Create `essays_reviews` join table
- Allow single essay to be reviewed by multiple people
- Support feedback from tutors, Reddit community, AI, etc.
- Manage multiple review sources per essay

---

### 15. Content Source Tracking
**Status:** Future
**Priority:** Low

**Requirements:**
- Add chapters, articles, or source content when adding words
- Track where vocabulary was encountered
- Link words to original reading material

---

### 16. Essay Sharing & Submission Options
**Status:** Future
**Priority:** Medium

**Requirements:**
- Essay submission modes:
  - Send to nobody (private/draft)
  - Send to tutor immediately
  - Share online publicly
- Implement when dedicated essay pages are complete
- Enable multi-person feedback on single essays

---

### 17. Advanced Grading Features
**Status:** Future
**Priority:** Low

**Requirements:**
- Enable grading of essay portions not from word bank
- Provide feedback on general writing, grammar, structure
- Expand beyond vocabulary-focused grading

---

### 18. AI-Powered Features
**Status:** Future
**Priority:** Low

**Requirements:**
- AI essay reviewer/feedback system
- Dictionary conjugation tables generated by AI
- AI-generated example sentences for vocabulary
- Automated language assistance features

---

## Implementation Notes

When implementing any feature from this roadmap:
1. Review the specific requirements listed
2. Examine existing codebase structure and patterns
3. Ensure consistency with current architecture
4. Consider impact on related features
5. Update this document when features are completed or requirements change
