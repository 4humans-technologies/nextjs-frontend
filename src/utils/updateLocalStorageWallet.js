export default function updateLCWallet(operation = "add", amount) {
  try {
    const lcUser = JSON.parse(localStorage.getItem("user"))
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...lcUser,
        relatedUser: {
          ...lcUser.relatedUser,
          wallet: {
            ...lcUser.relatedUser.wallet,
            currentAmount:
              operation === "set"
                ? amount
                : lcUser.relatedUser.wallet.currentAmount + operation === "add"
                ? amount
                : -amount,
          },
        },
      })
    )
    return { ok: true }
  } catch (err) {
    return { ok: false, err: err }
  }
}
