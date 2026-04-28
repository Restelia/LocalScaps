import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

/** Logged-in user id for demo; listings from Sell use this. */
export const CURRENT_USER_ID = "me"

export type FoodListing = {
  id: string
  title: string
  image: string
  description: string
  location: string
  expirationDate: string
  listedAt: string
  sellerId: string
  sellerName: string
}

const SEED_LISTINGS: FoodListing[] = [
  {
    id: "1",
    title: "Surplus Kale Bunch",
    image:
      "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?auto=format&fit=crop&w=1200&q=80",
    description: "Extra kale from the garden — great for chickens, composting, or juicing.",
    location: "Downtown",
    expirationDate: "Apr 17, 2026",
    listedAt: "Apr 14, 2026",
    sellerId: "seller-1",
    sellerName: "Maya Chen",
  },
  {
    id: "2",
    title: "Leftover Carrots",
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=1200&q=80",
    description: "Whole carrots, slightly soft — perfect for livestock feed or compost.",
    location: "West End",
    expirationDate: "Apr 16, 2026",
    listedAt: "Apr 12, 2026",
    sellerId: "seller-2",
    sellerName: "Jordan Lee",
  },
  {
    id: "3",
    title: "Mixed Cabbage Heads",
    image:
      "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=1200&q=80",
    description: "Green and purple cabbage — great for goats, pigs, or fermenting.",
    location: "East Side",
    expirationDate: "Apr 15, 2026",
    listedAt: "Apr 15, 2026",
    sellerId: "seller-3",
    sellerName: "Sam Rivera",
  },
  {
    id: "4",
    title: "Extra Zucchini",
    image:
      "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=1200&q=80",
    description: "Overgrown zucchini from the garden — livestock love them.",
    location: "North Market",
    expirationDate: "Apr 16, 2026",
    listedAt: "Apr 13, 2026",
    sellerId: "seller-1",
    sellerName: "Maya Chen",
  },
  {
    id: "5",
    title: "Beet Surplus",
    image:
      "https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=1200&q=80",
    description: "Fresh beets with greens attached — good for kombucha, animals, or soil.",
    location: "University District",
    expirationDate: "Apr 15, 2026",
    listedAt: "Apr 11, 2026",
    sellerId: "seller-2",
    sellerName: "Jordan Lee",
  },
  {
    id: "6",
    title: "Tomato Overstock",
    image:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=1200&q=80",
    description: "Ripe tomatoes in bulk — ideal for composting or feeding backyard animals.",
    location: "South Loop",
    expirationDate: "Apr 17, 2026",
    listedAt: "Apr 10, 2026",
    sellerId: "seller-3",
    sellerName: "Sam Rivera",
  },
]

export type AddListingInput = {
  title: string
  description: string
  location: string
  /** HTML date input value `YYYY-MM-DD` */
  expirationDateIso: string
  image: string
}

function formatShortDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

type ListingsContextValue = {
  listings: FoodListing[]
  addListing: (input: AddListingInput) => void
}

const ListingsContext = createContext<ListingsContextValue | null>(null)

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<FoodListing[]>(() => [...SEED_LISTINGS])

  const addListing = useCallback((input: AddListingInput) => {
    const now = new Date()
    const exp = input.expirationDateIso
      ? new Date(input.expirationDateIso + "T12:00:00")
      : now

    const newItem: FoodListing = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      description: input.description.trim(),
      location: input.location.trim(),
      image:
        input.image ||
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
      expirationDate: formatShortDate(exp),
      listedAt: formatShortDate(now),
      sellerId: CURRENT_USER_ID,
      sellerName: "Andy Tran",
    }

    setListings((prev) => [newItem, ...prev])
  }, [])

  const value = useMemo(
    () => ({
      listings,
      addListing,
    }),
    [listings, addListing]
  )

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>
}

export function useListings() {
  const ctx = useContext(ListingsContext)
  if (!ctx) {
    throw new Error("useListings must be used within ListingsProvider")
  }
  return ctx
}
