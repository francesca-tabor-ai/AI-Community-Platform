# Growth Engineer: Platform Growth Systems

> This document outlines the strategy for the Growth Engineer role, focusing on implementing systems and features designed to drive user acquisition, improve retention, and increase engagement on the platform.

## 1. Growth Feature Ideas

Our growth strategy will focus on building features that create viral loops and incentivize creators and readers to share the platform. The initial focus will be on a high-impact referral program.

| Feature Idea | Description | Target Metric |
| :--- | :--- | :--- |
| **Creator Referral Program** | A double-sided referral program. When a creator refers a new creator who starts publishing, both receive a benefit. This could be a cash bonus (e.g., $25 each) or a discount on platform fees. This creates a powerful incentive for creators to evangelize the platform. | **Creator Acquisition Cost (CAC)**, **Viral Coefficient (k)** |
| **Reader Referral Program** | Empower creators to launch their own referral programs for their publications. When a reader refers a new paid subscriber, they could get a free month of the subscription or exclusive content. This turns a creator's most loyal readers into a sales force. | **Subscriber Growth**, **Paid Subscription Conversion Rate** |
| **Publication Recommendations** | After a user subscribes to a newsletter, we will show them a curated list of 3-5 other publications they might be interested in. This cross-promotion helps new creators get discovered and provides a better experience for readers. | **Subscriber Growth**, **Creator Discovery** |
| **Content Sharing & SEO** | We will build best-in-class tools for social sharing and search engine optimization. This includes pre-populated social share text, beautiful social card images (`og:image`), and a fast, crawlable public website for every publication to maximize organic traffic from Google. | **User Acquisition**, **Top-of-Funnel Traffic** |

## 2. Experiment Design: A/B Testing the Creator Referral Program

To validate and optimize our growth features, we will use a rigorous A/B testing framework. Our first major experiment will be to determine the most effective incentive for the creator referral program.

- **Hypothesis:** A cash incentive will be more effective at driving creator referrals than a discount on platform fees.
- **Experiment Setup:**
    - **Control Group (Group A):** New creators are offered a 50% discount on platform fees for 3 months for every new creator they refer.
    - **Variant Group (Group B):** New creators are offered a $25 cash bonus (paid via Stripe) for every new creator they refer.
- **Primary Metric:** The number of successful referrals per creator in the first 30 days after they sign up.
- **Secondary Metrics:**
    - Activation rate of the referred creators (do they publish a post?).
    - Cost per acquisition for the new creators.
- **Implementation:** We will build a simple A/B testing framework internally or use a third-party service like **LaunchDarkly**. Users will be randomly assigned to a group upon sign-up, and their experience will be tagged with the experiment variant. All subsequent tracking events for that user will include the variant ID, allowing us to segment the results in our analytics platform.

## 3. Metrics Tracking Plan

To measure the success of our growth initiatives, we need to track a specific set of metrics. This will be built on top of the event tracking infrastructure designed by the Data Engineer.

- **Acquisition Metrics:**
    - **Viral Coefficient (k):** `k = (Number of existing users) * (Average number of invites sent per user) * (Conversion rate of invites)`. A `k` factor greater than 1 indicates exponential growth. This is our North Star metric for viral growth.
    - **Creator Acquisition Cost (CAC):** The total cost of sales and marketing to acquire a new active creator. Our goal is to lower this over time through our growth features.

- **Retention & Engagement Metrics:**
    - **Creator Cohort Retention:** What percentage of creators who sign up in a given month are still active 1, 3, and 6 months later? This is the ultimate measure of product-market fit.
    - **Subscriber Churn Rate:** The percentage of paid subscribers who cancel their subscriptions each month. Reducing this is key to long-term revenue growth.
    - **Engagement Score:** A composite score for creators based on their publishing frequency, subscriber open rates, and other engagement signals. This can help us identify at-risk creators and proactively intervene.

- **Instrumentation:** The Growth Engineer will work closely with the Frontend and Backend Engineers to ensure that all necessary events for tracking these metrics are implemented correctly. This includes events for `invite_sent`, `invite_accepted`, `referral_completed`, and tracking the source of every new user sign-up.

---

## 4. Implementation Notes: Required Events

To support the metrics above, extend the analytics schema (`lib/analytics/events.ts`) with:

| Event | Properties | Purpose |
|-------|------------|---------|
| `invite_sent` | inviter_id, invitee_email, referral_code, experiment_variant | Viral coefficient numerator |
| `invite_accepted` | inviter_id, invitee_id, referral_code | Conversion funnel |
| `referral_completed` | inviter_id, referred_id, referral_type (creator/reader), incentive_type | Reward payout triggers, CAC calculation |
| `user_registered` | + registration_source, referral_code | Attribution, referral conversion |
| `content_shared` | user_id, content_id, content_type, platform | Content Sharing & SEO impact |
| `creator_unsubscribed` | subscriber_id, creator_id | Subscriber churn rate |

**A/B testing:** Store `experiment_variant` (e.g., `referral_cash` / `referral_discount`) on user sign-up and include in all events for segmentation.
