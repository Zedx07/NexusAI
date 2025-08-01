class NexusAIChat {
  constructor() {
    // Initialize properties
    this.apiBaseUrl =
      localStorage.getItem("apiBaseUrl") || "http://localhost:3002";
    this.userId = localStorage.getItem("userId") || null;
    this.conversationId = null;
    this.autoScroll = localStorage.getItem("autoScroll") !== "false";
    this.soundEnabled = localStorage.getItem("soundEnabled") !== "false";

    this.isConnected = false;

    // Initialize UI
    this.initializeElements();
    this.bindEvents();
    this.checkConnection();
    this.updateWelcomeTime();
  }

  initializeElements() {
    // Verify all critical DOM elements exist

    // Main chat elements
    this.chatMessages = document.getElementById("chatMessages");
    if (!this.chatMessages) console.error("Chat messages container not found!");

    this.messageInput = document.getElementById("messageInput");
    this.sendBtn = document.getElementById("sendBtn");
    this.charCount = document.getElementById("charCount");
    this.conversationInfo = document.getElementById("conversationInfo");

    // Get or recreate typing indicator
    this.typingIndicator = document.getElementById("typingIndicator");
    if (!this.typingIndicator) {
      console.warn("Typing indicator not found in DOM, creating it");
      this.typingIndicator = document.createElement("div");
      this.typingIndicator.id = "typingIndicator";
      this.typingIndicator.className = "typing-indicator";
      this.typingIndicator.style.display = "none";
      this.typingIndicator.innerHTML = `
        <div class="message bot-message">
          <div class="message-avatar">
            <i class="fas fa-robot"></i>
          </div>
          <div class="message-content">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      `;

      // Add it to the chat container
      if (this.chatMessages) {
        this.chatMessages.appendChild(this.typingIndicator);
      }
    }

    // Status and control elements
    this.statusIndicator = document.getElementById("statusIndicator");
    this.statusDot = document.getElementById("statusDot");
    this.statusText = document.getElementById("statusText");
    this.clearBtn = document.getElementById("clearBtn");
    this.settingsBtn = document.getElementById("settingsBtn");

    // Settings modal elements
    this.settingsModal = document.getElementById("settingsModal");
    this.closeSettings = document.getElementById("closeSettings");
    this.saveSettings = document.getElementById("saveSettings");
    this.testConnection = document.getElementById("testConnection");

    // Settings inputs
    this.apiUrlInput = document.getElementById("apiUrl");
    this.userIdInput = document.getElementById("userId");
    this.autoScrollInput = document.getElementById("autoScroll");
    this.soundEnabledInput = document.getElementById("soundEnabled");

    // Toast container
    this.toastContainer = document.getElementById("toastContainer");
    if (!this.toastContainer) {
      console.warn("Toast container not found, creating it");
      this.toastContainer = document.createElement("div");
      this.toastContainer.id = "toastContainer";
      this.toastContainer.className = "toast-container";
      document.body.appendChild(this.toastContainer);
    }
  }

  bindEvents() {
    // Input and send message events
    this.messageInput.addEventListener("input", () => this.handleInputChange());
    this.messageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!this.sendBtn.disabled) {
          this.sendMessage();
        }
      }
    });
    this.sendBtn.addEventListener("click", () => this.sendMessage());

    // Button events
    this.clearBtn.addEventListener("click", () => this.clearConversation());
    this.settingsBtn.addEventListener("click", () => this.openSettings());

    // Settings modal events
    this.closeSettings.addEventListener("click", () =>
      this.closeModal(this.settingsModal)
    );
    this.saveSettings.addEventListener("click", () => this.saveUserSettings());
    this.testConnection.addEventListener("click", () =>
      this.testConnectionHandler()
    );

    // Close modal on outside click
    window.addEventListener("click", (e) => {
      if (e.target === this.settingsModal) {
        this.closeModal(this.settingsModal);
      }
    });

    // Auto-resize textarea
    this.messageInput.addEventListener("input", () =>
      this.autoResizeTextarea()
    );

    // Load settings into inputs
    this.loadSettingsToInputs();
  }

  handleInputChange() {
    const length = this.messageInput.value.length;
    this.charCount.textContent = `${length}/2000`;
    this.sendBtn.disabled = length === 0 || !this.isConnected;
  }

  autoResizeTextarea() {
    const textarea = this.messageInput;
    textarea.style.height = "auto";
    const scrollHeight = Math.min(textarea.scrollHeight, 120);
    textarea.style.height = scrollHeight + "px";
  }

  async sendMessage() {
    const message = this.messageInput.value.trim();
    if (!message || !this.isConnected) return;

    // Add user message to chat
    this.addMessage(message, "user");
    this.messageInput.value = "";
    this.handleInputChange();
    this.autoResizeTextarea();

    // Show typing indicator
    this.showTypingIndicator();

    try {
      // Prepare request payload
      const payload = {
        message: message,
      };

      // Add conversationId and userId if available
      if (this.conversationId) {
        payload.conversationId = this.conversationId;
      }
      if (this.userId) {
        payload.userId = this.userId;
      }

      const response = await fetch(`${this.apiBaseUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("API Response:", data);

      // Detailed logging for debugging
      console.log("Response status:", response.status);
      console.log("Success flag:", data.success);
      console.log("Full response data:", JSON.stringify(data, null, 2));

      if (response.ok && data.success) {
        // Update conversation ID if provided
        if (data.data.conversationId) {
          this.conversationId = data.data.conversationId;
          this.updateConversationInfo();
          console.log("Updated conversation ID:", this.conversationId);
        }

        // Add bot response to chat
        if (data.data.response) {
          console.log("Adding bot response to UI:", data.data.response);
          this.addMessage(data.data.response, "bot");
        } else {
          console.log("No response found in data");
          this.addMessage("No response received", "bot", true);
        }

        // Play notification sound if enabled
        if (this.soundEnabled) {
          this.playNotificationSound();
        }
      } else {
        const errorMessage =
          data.error?.message || data.error || "Failed to send message";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Provide more detailed error information
      const errorDetails = error.message || "Unknown error";
      console.error("Error details:", errorDetails);

      // Use a try/catch when adding the error message to prevent cascading DOM errors
      try {
        this.addMessage(
          `Sorry, I encountered an error processing your message: ${errorDetails}. Please try again.`,
          "bot",
          true
        );
      } catch (domError) {
        console.error("Failed to display error message in UI:", domError);
        // Last resort fallback - insert error directly into DOM
        try {
          const errorDiv = document.createElement("div");
          errorDiv.className = "message bot-message";
          errorDiv.innerHTML = `
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
            <div class="message-content">
              <div class="message-text error-message">Error: ${errorDetails}</div>
              <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
          `;
          this.chatMessages.appendChild(errorDiv);
        } catch (criticalError) {
          console.error("Critical DOM error:", criticalError);
        }
      }

      this.showToast("Error", errorDetails, "error");
    } finally {
      try {
        this.hideTypingIndicator();
      } catch (error) {
        console.warn("Error hiding typing indicator:", error);
      }
    }
  }
  addMessage(text, sender, isError = false) {
    // Create the message container div
    const messageDiv = document.createElement("div");

    // Set the correct class name that CSS expects
    messageDiv.className = `message ${sender}-message`;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Set the appropriate icon based on sender
    let icon = "user";
    if (sender === "bot") {
      icon = "robot";
    }

    // Format the message text
    const formattedText = this.formatMessage(text);

    // Create message HTML
    messageDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-${icon}"></i>
      </div>
      <div class="message-content">
        <div class="message-text ${isError ? "error-message" : ""}">
          ${formattedText}
        </div>
        <div class="message-time">${time}</div>
      </div>
    `;

    // Log for debugging
    console.log(`Adding ${sender} message with class: ${messageDiv.className}`);
    console.log("Message content:", formattedText);

    // Add to chat container - use safer approach
    try {
      // First check if typing indicator is both visible and in the DOM
      if (
        this.typingIndicator.style.display !== "none" &&
        this.chatMessages.contains(this.typingIndicator)
      ) {
        this.chatMessages.insertBefore(messageDiv, this.typingIndicator);
      } else {
        // Simply append to the end if typing indicator isn't visible or not in DOM
        this.chatMessages.appendChild(messageDiv);
      }
    } catch (error) {
      // Fallback if insertBefore fails for any reason
      console.warn(
        "Failed to insert before typing indicator, appending instead:",
        error
      );
      this.chatMessages.appendChild(messageDiv);
    }

    // Auto-scroll if enabled
    if (this.autoScroll) {
      this.scrollToBottom();
    }
  }

  formatMessage(text) {
    if (!text) return "No message content";

    // Convert text to string
    text = String(text);

    // Convert URLs to links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    text = text.replace(
      urlRegex,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Convert newlines to <br>
    text = text.replace(/\n/g, "<br>");

    return text;
  }

  showTypingIndicator() {
    // Make sure the typing indicator is appended to chatMessages if it's not already
    if (!this.chatMessages.contains(this.typingIndicator)) {
      // Try to reattach if it's not in the DOM
      try {
        this.chatMessages.appendChild(this.typingIndicator);
      } catch (error) {
        console.warn(
          "Could not attach typing indicator to chat container:",
          error
        );
      }
    }

    // Show the typing indicator
    this.typingIndicator.style.display = "block";

    if (this.autoScroll) {
      this.scrollToBottom();
    }
  }

  hideTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "none";
    }
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  clearConversation() {
    if (!confirm("Are you sure you want to clear this conversation?")) {
      return;
    }

    // Reset conversation state
    this.conversationId = null;
    this.updateConversationInfo();

    // Clear messages except welcome message
    const welcomeMessage = document.querySelector(".welcome-message");
    this.chatMessages.innerHTML = "";
    if (welcomeMessage) {
      this.chatMessages.appendChild(welcomeMessage);
    }

    this.showToast("Success", "Conversation cleared", "success");
  }

  async checkConnection() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/health`);

      if (response.ok) {
        this.setConnectionStatus(true, "Connected");

        // Add a test message to verify message display is working
        try {
          // Wait a moment to ensure DOM is ready
          setTimeout(() => {
            console.log("Adding test message to verify UI");
            // Try with a safer version of addMessage
            const testMessage =
              "This is a test message to verify the UI is working properly. If you see this, the message display works!";
            this.addMessage(testMessage, "bot");
          }, 1000);
        } catch (err) {
          console.warn("Could not add test message:", err);
        }

        return true;
      } else {
        throw new Error("Health check failed");
      }
    } catch (error) {
      console.error("Connection check failed:", error);
      this.setConnectionStatus(false, "Offline");
      return false;
    }
  }

  setConnectionStatus(connected, text) {
    this.isConnected = connected;
    this.statusText.textContent = text;
    this.statusDot.className = `status-dot ${connected ? "online" : "offline"}`;
    this.sendBtn.disabled =
      !connected || this.messageInput.value.trim().length === 0;
  }

  openSettings() {
    this.showModal(this.settingsModal);
  }

  showModal(modal) {
    modal.classList.add("show");
  }

  closeModal(modal) {
    modal.classList.remove("show");
  }

  loadSettingsToInputs() {
    this.apiUrlInput.value = this.apiBaseUrl;
    this.userIdInput.value = this.userId || "";
    this.autoScrollInput.checked = this.autoScroll;
    this.soundEnabledInput.checked = this.soundEnabled;
  }

  saveUserSettings() {
    this.apiBaseUrl = this.apiUrlInput.value.trim();
    this.userId = this.userIdInput.value.trim() || null;
    this.autoScroll = this.autoScrollInput.checked;
    this.soundEnabled = this.soundEnabledInput.checked;

    // Save to localStorage
    localStorage.setItem("apiBaseUrl", this.apiBaseUrl);
    localStorage.setItem("userId", this.userId || "");
    localStorage.setItem("autoScroll", this.autoScroll.toString());
    localStorage.setItem("soundEnabled", this.soundEnabled.toString());

    this.closeModal(this.settingsModal);
    this.showToast("Success", "Settings saved successfully", "success");

    // Recheck connection with new URL
    this.checkConnection();
  }

  async testConnectionHandler() {
    this.setConnectionStatus(false, "Testing...");
    const success = await this.checkConnection();
    if (success) {
      this.showToast("Success", "Connection successful", "success");
    } else {
      this.showToast("Error", "Could not connect to API", "error");
    }
  }

  updateWelcomeTime() {
    const welcomeTimeElement = document.getElementById("welcomeTime");
    if (welcomeTimeElement) {
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      welcomeTimeElement.textContent = time;
    }
  }

  updateConversationInfo() {
    if (this.conversationId) {
      this.conversationInfo.textContent = `Conversation: ${this.conversationId.substring(
        0,
        8
      )}...`;
    } else {
      this.conversationInfo.textContent = "";
    }
  }

  playNotificationSound() {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.1,
        audioContext.currentTime + 0.01
      );
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log("Could not play notification sound:", error);
    }
  }

  showToast(title, message, type = "info") {
    try {
      // Make sure we have a toast container
      if (
        !this.toastContainer ||
        !document.body.contains(this.toastContainer)
      ) {
        console.warn("Toast container not in DOM, recreating it");
        this.toastContainer = document.createElement("div");
        this.toastContainer.id = "toastContainer";
        this.toastContainer.className = "toast-container";
        document.body.appendChild(this.toastContainer);
      }

      // Create and add the toast
      const toast = document.createElement("div");
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      `;

      this.toastContainer.appendChild(toast);

      // Auto-remove toast after delay
      setTimeout(() => {
        try {
          toast.style.animation = "toastSlideIn 0.3s ease-out reverse";
          setTimeout(() => {
            if (toast.parentNode) {
              toast.parentNode.removeChild(toast);
            }
          }, 300);
        } catch (error) {
          console.warn("Error removing toast:", error);
          // Try direct removal as fallback
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }
      }, 4000);
    } catch (error) {
      console.error("Failed to show toast notification:", error);
    }
  }
}

// Initialize the chat application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.chatApp = new NexusAIChat();
});
