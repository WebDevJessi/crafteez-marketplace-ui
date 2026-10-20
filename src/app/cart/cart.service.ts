import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Cart, CartItem } from "../models/cart.model";
import { BehaviorSubject } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Product } from "../shared/types/product.interface";

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private readonly storageKey = 'crafteez.cart.v1';
    readonly cart: BehaviorSubject<Cart>;

    constructor(
        private _snackBar: MatSnackBar,
        @Inject(PLATFORM_ID) private platformId: object,
    ) {
        this.cart = new BehaviorSubject<Cart>({ items: this.loadCart() });
    }

    addToCart(item: CartItem): void {
        const existingItem = this.cart.value.items.find(({ id }) => id === item.id);
        let items: CartItem[];

        if (existingItem) {
            items = this.cart.value.items.map((cartItem) =>
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            );
        } else {
            items = [...this.cart.value.items, { ...item }];
        }

        this.publishCart({ items });
        this._snackBar.open('1 item added to cart.', 'Ok', {
             duration: 3000,
             });
    }

    removeFromCart(item: CartItem, updateCart = true): CartItem[] {
        const filteredItems = this.cart.value.items.filter(
            (_item) => _item.id !== item.id
        );

        if (updateCart) {
            this.publishCart({ items: filteredItems });
            this._snackBar.open('1 item removed from cart.', 'Ok', {
                duration: 3000,
             });
        }
        return filteredItems;
    }

    removeQuantity(item: CartItem): void {
        const items = this.cart.value.items.flatMap((cartItem) => {
            if (cartItem.id !== item.id) {
                return [cartItem];
            }

            return cartItem.quantity > 1
                ? [{ ...cartItem, quantity: cartItem.quantity - 1 }]
                : [];
        });

        this.publishCart({ items });
        this._snackBar.open('1 item removed from cart.', 'Ok', {
             duration: 3000,
             });
    }

    clearCart(): void {
        this.publishCart({ items: [] });
        this._snackBar.open('Cart is cleared.', 'Ok', {
            duration: 3000,
         });
    }

    syncWithProducts(products: Product[]): number {
        const productsById = new Map(products.map((product) => [product.id, product]));
        const currentItems = this.cart.value.items;
        const items = currentItems.flatMap((item) => {
            const product = productsById.get(item.id);
            if (!product) {
                return [];
            }

            return [{
                id: product.id,
                product: product.imageUrl,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            }];
        });

        this.publishCart({ items });
        return currentItems.length - items.length;
    }

    getTotal(items: CartItem[]): number {
        return items
        .map((item) => item.price * item.quantity)
        .reduce((prev, current) => prev + current, 0);
    }

    private publishCart(cart: Cart): void {
        this.cart.next(cart);

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        try {
            localStorage.setItem(this.storageKey, JSON.stringify(cart));
        } catch (error) {
            console.error('Unable to save the cart in browser storage.', error);
        }
    }

    private loadCart(): CartItem[] {
        if (!isPlatformBrowser(this.platformId)) {
            return [];
        }

        try {
            const savedCart = localStorage.getItem(this.storageKey) ?? localStorage.getItem('cart');
            if (!savedCart) {
                return [];
            }

            const parsed: unknown = JSON.parse(savedCart);
            if (isCart(parsed)) {
                return parsed.items;
            }

            console.warn('Saved cart data is invalid and will be ignored.');
        } catch (error) {
            console.error('Unable to read the saved cart from browser storage.', error);
        }

        return [];
    }
}

function isCart(value: unknown): value is Cart {
    if (!value || typeof value !== 'object' || !Array.isArray((value as Cart).items)) {
        return false;
    }

    return (value as Cart).items.every((item: unknown) => {
        if (!item || typeof item !== 'object') {
            return false;
        }

        const cartItem = item as CartItem;
        return (typeof cartItem.id === 'string' || (typeof cartItem.id === 'number' && Number.isFinite(cartItem.id)))
            && typeof cartItem.product === 'string'
            && typeof cartItem.name === 'string'
            && typeof cartItem.price === 'number'
            && Number.isFinite(cartItem.price)
            && cartItem.price >= 0
            && Number.isInteger(cartItem.quantity)
            && cartItem.quantity > 0;
    });
}
