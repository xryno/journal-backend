```mermaid
---
title: Database design
---

erDiagram
    USER ||--o{ ENTRY : creates
    USER {
        string userId
        string name
        string email
        string password
    }
    
    ENTRY {
        string entryId
        string userId
        string date
        string description
        string evidence
        string knowledge
        string skills
        strin behaviours
    }
  
```