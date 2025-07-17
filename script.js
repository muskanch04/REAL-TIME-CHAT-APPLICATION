class ChatApp {
  constructor() {
    this.currentUser = "You"
    this.messages = [
      {
        id: 1,
        sender: "Neha",
        text: "Hey everyone! Welcome to our chat room! 👋",
        timestamp: new Date(Date.now() - 300000),
        avatar: "i.1.jpeg",
        isOwn: false,
      },
      {
        id: 2,
        sender: "You",
        text: "Thanks Neha! This looks amazing. How is everyone doing today?",
        timestamp: new Date(Date.now() - 240000),
        avatar: "i.4.jpeg",
        isOwn: true,
      },
      {
        id: 3,
        sender: "Kunal",
        text: "Doing great! Just finished working on a new project. What about you all?",
        timestamp: new Date(Date.now() - 180000),
        avatar: "i.2.jpeg",
        isOwn: false,
      },
      {
        id: 4,
        sender: "Shiva",
        text: "Same here! Building some cool stuff with JavaScript and WebSockets 🚀",
        timestamp: new Date(Date.now() - 120000),
        avatar: "i.3.jpeg",
        isOwn: false,
      },
      {
        id: 5,
        sender: "You",
        text: "That sounds exciting! I love working with real-time applications.",
        timestamp: new Date(Date.now() - 60000),
        avatar: "i.4.jpeg",
        isOwn: true,
      },
    ]

    this.users = [
      {
        id: 1,
        name: "Neha",
        status: "online",
        avatar: "i.1.jpeg",
        lastSeen: null,
      },
      {
        id: 2,
        name: "Raj",
        status: "online",
        avatar: "i.5.jpeg",
        lastSeen: null,
      },
      {
        id: 3,
        name: "Kunal",
        status: "offline",
        avatar: "i.2.jpeg",
        lastSeen: new Date(Date.now() - 300000),
      },
      {
        id: 4,
        name: "Shiva",
        status: "online",
        avatar: "i.3.jpeg",
        lastSeen: null,
      },
    ]

    this.isTyping = false
    this.typingUser = ""
    this.typingTimeout = null

    this.initializeElements()
    this.bindEvents()
    this.renderUsers()
    this.renderMessages()
    this.startRealTimeSimulation()
  }

  initializeElements() {
    this.messagesList = document.getElementById("messages-list")
    this.messageInput = document.getElementById("message-input")
    this.sendBtn = document.getElementById("send-btn")
    this.usersList = document.getElementById("users-list")
    this.onlineCount = document.getElementById("online-count")
    this.typingIndicator = document.getElementById("typing-indicator")
    this.typingUser = document.getElementById("typing-user")
    this.messagesContainer = document.getElementById("messages-container")
    this.notificationSound = document.getElementById("notification-sound")
  }

  bindEvents() {
    // Send message on Enter key
    this.messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        this.sendMessage()
      }
    })

    // Send message on button click
    this.sendBtn.addEventListener("click", () => {
      this.sendMessage()
    })

    // Update send button state
    this.messageInput.addEventListener("input", () => {
      const hasText = this.messageInput.value.trim().length > 0
      this.sendBtn.classList.toggle("active", hasText)
    })

    // Simulate typing indicator
    this.messageInput.addEventListener("input", () => {
      this.simulateTyping()
    })

    // Room switching
    document.querySelectorAll(".room-item").forEach((room) => {
      room.addEventListener("click", () => {
        document.querySelectorAll(".room-item").forEach((r) => r.classList.remove("active"))
        room.classList.add("active")
      })
    })
  }

  renderUsers() {
    const onlineUsers = this.users.filter((user) => user.status === "online")
    this.onlineCount.textContent = onlineUsers.length

    this.usersList.innerHTML = this.users
      .map(
        (user) => `
      <div class="user-item">
        <div class="avatar">
          <img src="${user.avatar}" alt="${user.name}">
          <div class="status-indicator ${user.status}"></div>
        </div>
        <div class="user-info">
          <span class="username">${user.name}</span>
          <span class="user-status">
            ${
              user.status === "online"
                ? "Online"
                : user.status === "offline"
                  ? "Offline"
                  : `Last seen ${this.formatLastSeen(user.lastSeen)}`
            }
          </span>
        </div>
      </div>
    `,
      )
      .join("")
  }

  renderMessages() {
    this.messagesList.innerHTML = this.messages
      .map(
        (message) => `
      <div class="message ${message.isOwn ? "own" : ""}">
        ${!message.isOwn ? `<img src="${message.avatar}" alt="${message.sender}" class="message-avatar">` : ""}
        <div class="message-content">
          <div class="message-header">
            <span class="message-sender">${message.sender}</span>
            <span class="message-time">${this.formatTime(message.timestamp)}</span>
          </div>
          <div class="message-bubble">
            <div class="message-text">${message.text}</div>
          </div>
        </div>
        ${message.isOwn ? `<img src="${message.avatar}" alt="${message.sender}" class="message-avatar">` : ""}
      </div>
    `,
      )
      .join("")

    this.scrollToBottom()
  }

  sendMessage() {
    const text = this.messageInput.value.trim()
    if (!text) return

    const message = {
      id: Date.now(),
      sender: this.currentUser,
      text: text,
      timestamp: new Date(),
      avatar: "i.4.jpeg",
      isOwn: true,
    }

    this.messages.push(message)
    this.messageInput.value = ""
    this.sendBtn.classList.remove("active")

    this.renderMessages()
    this.playNotificationSound()
  }

  simulateIncomingMessage() {
    const sampleMessages = [
      "That's a great point! 👍",
      "I totally agree with that approach.",
      "Has anyone tried the new framework?",
      "The weather is beautiful today! ☀️",
      "Just finished my coffee break ☕",
      "Working on some exciting features!",
      "Anyone up for a quick call?",
      "Great job on the presentation! 🎉",
      "Let's discuss this in more detail.",
      "I'll share the documentation shortly.",
      "The new update looks promising!",
      "Thanks for the helpful feedback! 🙏",
    ]

    const activeUsers = this.users.filter((user) => user.status === "online" && user.name !== this.currentUser)
    if (activeUsers.length === 0) return

    const randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)]
    const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)]

    const message = {
      id: Date.now(),
      sender: randomUser.name,
      text: randomMessage,
      timestamp: new Date(),
      avatar: randomUser.avatar,
      isOwn: false,
    }

    this.messages.push(message)
    this.renderMessages()
    this.playNotificationSound()
  }

  simulateTyping() {
    if (Math.random() > 0.3) return // 30% chance to trigger typing

    const activeUsers = this.users.filter((user) => user.status === "online" && user.name !== this.currentUser)
    if (activeUsers.length === 0) return

    const randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)]

    this.showTypingIndicator(randomUser.name, randomUser.avatar)

    setTimeout(
      () => {
        this.hideTypingIndicator()
      },
      2000 + Math.random() * 3000,
    )
  }

  showTypingIndicator(userName, userAvatar) {
    if (this.isTyping) return

    this.isTyping = true
    this.typingUser.textContent = userName
    this.typingIndicator.querySelector(".typing-avatar img").src = userAvatar
    this.typingIndicator.style.display = "flex"
    this.scrollToBottom()
  }

  hideTypingIndicator() {
    this.isTyping = false
    this.typingIndicator.style.display = "none"
  }

  startRealTimeSimulation() {
    // Simulate incoming messages
    setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance every interval
        this.simulateIncomingMessage()
      }
    }, 8000)

    // Simulate typing indicators
    setInterval(() => {
      if (Math.random() > 0.8 && !this.isTyping) {
        // 20% chance if not already typing
        this.simulateTyping()
      }
    }, 5000)

    // Simulate user status changes
    setInterval(() => {
      if (Math.random() > 0.9) {
        // 10% chance
        this.simulateStatusChange()
      }
    }, 15000)
  }

  simulateStatusChange() {
    const user = this.users[Math.floor(Math.random() * this.users.length)]
    const statuses = ["online", "away", "offline"]
    const currentIndex = statuses.indexOf(user.status)
    const newStatus = statuses[(currentIndex + 1) % statuses.length]

    user.status = newStatus
    if (newStatus !== "online") {
      user.lastSeen = new Date()
    }

    this.renderUsers()
  }

  formatTime(date) {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`

    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  formatLastSeen(date) {
    if (!date) return "Never"

    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
    return `${Math.floor(minutes / 1440)}d ago`
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight
    }, 100)
  }

  playNotificationSound() {
    try {
      this.notificationSound.currentTime = 0
      this.notificationSound.play().catch(() => {
        // Ignore audio play errors (browser restrictions)
      })
    } catch (error) {
      // Ignore audio errors
    }
  }
}

// Initialize the chat app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ChatApp()
})

// Add some additional interactive features
document.addEventListener("DOMContentLoaded", () => {
  // Mobile sidebar toggle (for responsive design)
  const createMobileToggle = () => {
    const header = document.querySelector(".chat-header")
    const toggleBtn = document.createElement("button")
    toggleBtn.className = "mobile-toggle"
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>'
    toggleBtn.style.cssText = `
      display: none;
      background: none;
      border: none;
      font-size: 18px;
      color: #7f8c8d;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
    `

    // Add mobile styles
    const style = document.createElement("style")
    style.textContent = `
      @media (max-width: 768px) {
        .mobile-toggle {
          display: block !important;
        }
      }
    `
    document.head.appendChild(style)

    toggleBtn.addEventListener("click", () => {
      document.querySelector(".sidebar").classList.toggle("open")
    })

    header.insertBefore(toggleBtn, header.firstChild)
  }

  createMobileToggle()

  // Add emoji reactions (visual feedback)
  document.addEventListener("click", (e) => {
    if (e.target.closest(".message-bubble")) {
      const bubble = e.target.closest(".message-bubble")
      const reaction = document.createElement("div")
      reaction.textContent = "👍"
      reaction.style.cssText = `
        position: absolute;
        top: -10px;
        right: -10px;
        background: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        animation: reactionPop 0.3s ease-out;
      `

      // Add animation
      if (!document.querySelector("#reaction-styles")) {
        const reactionStyle = document.createElement("style")
        reactionStyle.id = "reaction-styles"
        reactionStyle.textContent = `
          @keyframes reactionPop {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
          }
        `
        document.head.appendChild(reactionStyle)
      }

      bubble.style.position = "relative"
      bubble.appendChild(reaction)

      setTimeout(() => {
        reaction.remove()
      }, 2000)
    }
  })
})
