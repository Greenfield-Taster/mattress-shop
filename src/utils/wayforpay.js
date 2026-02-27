let scriptLoaded = false
let scriptLoading = false
let loadCallbacks = []

function loadWayForPayScript() {
  return new Promise((resolve, reject) => {
    if (scriptLoaded) {
      resolve()
      return
    }

    if (scriptLoading) {
      loadCallbacks.push({ resolve, reject })
      return
    }

    scriptLoading = true

    const script = document.createElement("script")
    script.src = "https://secure.wayforpay.com/server/pay-widget.js"
    script.async = true

    script.onload = () => {
      scriptLoaded = true
      scriptLoading = false
      resolve()
      loadCallbacks.forEach((cb) => cb.resolve())
      loadCallbacks = []
    }

    script.onerror = () => {
      scriptLoading = false
      const error = new Error("Failed to load WayForPay script")
      reject(error)
      loadCallbacks.forEach((cb) => cb.reject(error))
      loadCallbacks = []
    }

    document.head.appendChild(script)
  })
}

/**
 * Opens WayForPay payment widget.
 * @param {object} paymentData — signed payment data from backend
 * @returns {Promise<{status: 'approved'|'declined'|'pending'|'closed', response?: object}>}
 */
export async function openPayment(paymentData) {
  await loadWayForPayScript()

  return new Promise((resolve) => {
    const wayforpay = new window.Wayforpay()

    wayforpay.run(
      paymentData,
      function (response) {
        resolve({ status: "approved", response })
      },
      function (response) {
        resolve({ status: "declined", response })
      },
      function (response) {
        resolve({ status: "pending", response })
      }
    )

    window.addEventListener(
      "message",
      function handler(event) {
        if (
          event.data === "WfpWidgetEventClose" ||
          event.data?.type === "WfpWidgetEventClose"
        ) {
          window.removeEventListener("message", handler)
          resolve({ status: "closed" })
        }
      }
    )
  })
}
