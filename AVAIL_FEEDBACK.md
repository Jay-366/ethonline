# **Avail Developer Feedback**

### **1. Inconsistent and Frequently Changing Elements Documentation**

I’ve been reading the Nexus Elements documentation daily, and I noticed that around three days ago, the documentation and component structure were changed without any notice or changelog.

This sudden update caused confusion because previous references, URLs, and installation commands (e.g., https://elements.nexus.availproject.org/r/fast-bridge.json) no longer worked.

The registry error below occurred after the change:

The item at /r/skeleton.json was not found. It may not exist at the registry.


Such frequent undocumented changes make it difficult to maintain stable local development environments.

Here is the image of installation problem while installing fast bridge component:

<img width="2560" height="1600" alt="Screenshot 2025-10-25 214100" src="https://github.com/user-attachments/assets/029a6e12-326f-4cf1-abe8-c46a74f5ddf3" />

---

### **2. Documentation and SDK Behavior Mismatch**

Here are some images screenshot from the Nexus Documentation is

<img width="2560" height="1600" alt="image" src="https://github.com/user-attachments/assets/11d3d276-45e9-41bc-8713-2776a2f06198" />

<img width="2560" height="1600" alt="image" src="https://github.com/user-attachments/assets/53ddfa77-5727-4807-8030-1d5fd7544834" />

So after reading the Nexus Documentation, what I get is Nexus SDk offers a **work flow** start from **create intent - source fees & gas fees overview - allow/deny allowance - bridge - transaction** for users.

However when I tried to use the fast-bridge component to view the ui and function of how is the intent and allowance looks like, **these features are not visible or initialize properly**. Which means once I bridge token, the transaction didn't go through the **work flow**

https://github.com/user-attachments/assets/2ecb81ec-088e-425e-b05f-736c1a6e203c

I have tried to search any code that related to the **intent** and **allowance**, I just saw these code which is **Intent Management** and **Allowance Management**. The Nexus Documentation only explain the function but without some simple example with other code on how the **intent** and **allowance** work with other functions. I have tried integrated into my project but the result I get still same.

Besides, there is no description or any explantion for showing us how to view the intent and the **Avail Intent Explorer**.

<img width="1403" height="1000" alt="image" src="https://github.com/user-attachments/assets/01b03c8b-a972-4b59-9274-08511de529dc" />

---

### Overall Developer Experience

The SDK and Elements are powerful but currently hard to work with due to changing docs, unclear flow, and missing UI visibility for intents and allowances.

These inconsistencies make it difficult to debug and understand what’s happening behind each step.
