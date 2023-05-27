import * as skyblockAssets from 'skyblock-assets'
import { vanilla } from '$lib/packs'
import { browser } from '$app/environment'

export interface Item {
    id?: string
    count?: number
    vanillaId: string

    display?: {
        name?: string
        lore?: string[]
        glint?: boolean
    }

    reforge?: string
    anvil_uses?: number
    timestamp?: string
    enchantments?: { [name: string]: number }

    headTexture?: string
}

const INVENTORIES = {
    armor: 'inv_armor',
    inventory: 'inv_contents',
    ender_chest: 'ender_chest_contents',
    accessory_bag: 'talisman_bag',
    potion_bag: 'potion_bag',
    fishing_bag: 'fishing_bag',
    quiver: 'quiver',
    trick_or_treat_bag: 'candy_inventory_contents',
    backpack: 'backpack_contents',
    wardrobe: 'wardrobe_contents',
    personal_vault: 'personal_vault_contents'
}

export const inventoryIconMap: Record<string, string | Item> = {
    inventory: {
        id: 'SKYBLOCK_MENU',
        vanillaId: 'nether_star',
        display: { name: 'SkyBlock Menu' },
    },
    ender_chest: {
        vanillaId: 'ender_chest',
        display: { name: '\\u00a7aEnder Chest' },
    },
    accessory_bag: {
        vanillaId: 'skull:3',
        display: { name: 'Accessory Bag' },
        headTexture: '961a918c0c49ba8d053e522cb91abc74689367b4d8aa06bfc1ba9154730985ff',
    },
    potion_bag: {
        vanillaId: 'skull:3',
        display: { name: 'Potion Bag' },
        headTexture: '9f8b82427b260d0a61e6483fc3b2c35a585851e08a9a9df372548b4168cc817c',
    },
    fishing_bag: {
        vanillaId: 'skull:3',
        display: { name: 'Fishing Bag' },
        headTexture: 'eb8e297df6b8dffcf135dba84ec792d420ad8ecb458d144288572a84603b1631',
    },
    quiver: {
        vanillaId: 'skull:3',
        display: {
            name: 'Quiver',
        },
        headTexture: '4cb3acdc11ca747bf710e59f4c8e9b3d949fdd364c6869831ca878f0763d1787',
    },
    wardrobe: {
        vanillaId: 'leather_chestplate',
        display: {
            name: '\\u00a7aWardrobe',
        },
    },
    trick_or_treat_bag: {
        vanillaId: 'skull:3',
        display: {
            name: 'Trick or Treat Bag',
        },
        headTexture: 'e50f712e877dfd910c97f3819a200a05d49ee6b83b592686e099b9ecd443f228',
    },
    backpacks: {
        vanillaId: 'skull:3',
        display: {
            name: 'Backpacks',
        },
        headTexture: '1f8405116c1daa7ce2f012591458d50246d0a467bcb95a5a2c033aefd6008b63'
    },
    personal_vault: {
        vanillaId: 'iron_door',
        display: {
            lore: [
                '§7Store your valuable items in a',
                '§7safe place that only you can',
                '§7access!',
                '',
                '§eClick to view!',
            ],
            name: '§aPersonal Vault',
        },
    },
}


export type Inventories = { [name in keyof typeof INVENTORIES]: Item[] }

// we cache the item urls because it takes a bit of time to get them usually
// { "<pack> <item id>": "https://..." }
let itemUrlCache: Record<string, string> = {}
// clear the cache every 120 seconds, this number is arbitrary
setInterval(() => {
    itemUrlCache = {}
}, 120 * 1000)
export function itemToUrl(item: Item, pack?: skyblockAssets.MatcherFile, headSize?: number): string {
    const itemNbt: skyblockAssets.NBT = {
        display: {
            Name: item.display?.name
        },
        ExtraAttributes: {
            id: item.id,
        },
    }
    let textureUrl: string

    const itemCacheIdentifier = `${pack?.dir ?? 'v'} ${JSON.stringify(item)} ${JSON.stringify(itemNbt)}`
    if (itemCacheIdentifier in itemUrlCache)
        return itemUrlCache[itemCacheIdentifier]

    if (item.headTexture) {
        // if it's a head, try without vanilla and if it fails just use the mc-heads url
        textureUrl = skyblockAssets.getTextureUrl({
            id: item.vanillaId,
            nbt: itemNbt,
            packs: pack ? [pack] : [],
            noNullTexture: true
        })
        if (textureUrl === null) {
            textureUrl = `https://mc-heads.net/head/${item.headTexture}`
            if (headSize)
                textureUrl += `/${headSize}`
        }
    } else {
        textureUrl = skyblockAssets.getTextureUrl({
            id: item.vanillaId,
            nbt: itemNbt,
            packs: pack ? [pack, vanilla as skyblockAssets.MatcherFile] : [vanilla as skyblockAssets.MatcherFile],
        })
    }
    itemUrlCache[itemCacheIdentifier] = textureUrl
    return textureUrl
}

export function skyblockItemToUrl(skyblockItem: string | Item, pack?: skyblockAssets.MatcherFile, headSize?: number) {
    const item = typeof skyblockItem === 'string' ? skyblockItemNameToItem(skyblockItem) : skyblockItem
    const itemTextureUrl = itemToUrl(item, pack, headSize)
    return itemTextureUrl
}


export function skyblockItemNameToItem(skyblockItemName: string): Item {
    let item: Item
    if (Object.keys(skyblockItems).includes(skyblockItemName)) {
        item = skyblockItems[skyblockItemName]
    } else {
        item = {
            vanillaId: `minecraft:${skyblockItemName}`
        }
    }
    return item
}

const skyblockItems: { [itemName: string]: Item } = {
    ink_sac: { vanillaId: 'minecraft:dye' },
    cocoa_beans: { vanillaId: 'minecraft:dye:3' },
    lapis_lazuli: { vanillaId: 'minecraft:dye:4' },
    lily_pad: { vanillaId: 'minecraft:waterlily' },
    melon_slice: { vanillaId: 'minecraft:melon' },
    mithril_ore: {
        vanillaId: 'minecraft:prismarine_crystals',
        display: { name: 'Mithril Ore' }
    },
    acacia_log: { vanillaId: 'minecraft:log2' },
    birch_log: { vanillaId: 'minecraft:log:2' },
    cod: { vanillaId: 'minecraft:fish' },
    dark_oak_log: { vanillaId: 'minecraft:log2:1' },
    jungle_log: { vanillaId: 'minecraft:log:3' },
    oak_log: { vanillaId: 'minecraft:log' },
    pufferfish: { vanillaId: 'minecraft:fish:3' },
    salmon: { vanillaId: 'minecraft:fish:1' },
    spruce_log: { vanillaId: 'minecraft:log:1' },
    gemstone: {
        vanillaId: 'minecraft:skull',
        headTexture: '39b6e047d3b2bca85e8cc49e5480f9774d8a0eafe6dfa9559530590283715142'
    },
    hard_stone: { vanillaId: 'minecraft:stone' },
    sulphur: {
        vanillaId: 'minecraft:glowstone_dust',
        display: { name: 'Sulphur' },
        id: 'SULPHUR_ORE'
    },
    magmafish: {
        vanillaId: 'minecraft:skull',
        headTexture: 'f56b5955b295522c9689481960c01a992ca1c7754cf4ee313c8dd0c356d335f',
        id: 'MAGMA_FISH'
    },
    chili_pepper: {
        vanillaId: 'minecraft:skull',
        headTexture: 'f859c8df1109c08a756275f1d2887c2748049fe33877769a7b415d56eda469d8',
        id: 'CHILI_PEPPER'
    }
}