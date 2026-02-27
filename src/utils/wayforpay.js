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
    let resolved = false
    const wayforpay = new window.Wayforpay()

    function handler(event) {
      if (
        event.data === "WfpWidgetEventClose" ||
        event.data?.type === "WfpWidgetEventClose"
      ) {
        if (!resolved) {
          resolved = true
          resolve({ status: "closed" })
        }
        window.removeEventListener("message", handler)
      }
    }
    window.addEventListener("message", handler)

    function done(status, response) {
      if (!resolved) {
        resolved = true
        window.removeEventListener("message", handler)
        resolve({ status, response })
      }
    }

    wayforpay.run(
      paymentData,
      (response) => done("approved", response),
      (response) => done("declined", response),
      (response) => done("pending", response)
    )
  })
}
