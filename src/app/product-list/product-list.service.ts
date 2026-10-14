import { Injectable } from "@angular/core";
import { catchError, map, throwError } from "rxjs";
import { Product } from "../shared/types/product.interface";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../env.development";

interface BackendProduct {
  id?: number | string;
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  isAvailable?: boolean;
  imageUrl?: string;
  pictures?: Record<string, unknown> | string[] | string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductListService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.apiUrl.replace(/\/$/, '')}/api/products`;

  products$ = this.http.get<unknown>(this.apiUrl).pipe(
    map((response) => extractProductRecords(response)
      .filter((product) => product.isAvailable !== false)
      .map(toProduct)),
    catchError((error) => {
      console.error('Error fetching products:', error);
      return throwError(() => error);
    })
  );
}

function extractProductRecords(response: unknown): BackendProduct[] {
  if (Array.isArray(response)) {
    return response as BackendProduct[];
  }

  if (!response || typeof response !== 'object') {
    return [];
  }

  const record = response as Record<string, unknown>;
  const payload = record['data'] ?? record['products'] ?? response;

  if (Array.isArray(payload)) {
    return payload as BackendProduct[];
  }

  if (payload && typeof payload === 'object') {
    return [payload as BackendProduct];
  }

  return [];
}

function getPictureUrl(pictures: BackendProduct['pictures']): string | undefined {
  if (typeof pictures === 'string') {
    return pictures;
  }

  if (Array.isArray(pictures)) {
    return pictures.find((picture): picture is string => typeof picture === 'string');
  }

  if (pictures && typeof pictures === 'object') {
    return Object.values(pictures).find((picture): picture is string => typeof picture === 'string');
  }

  return undefined;
}

function toProduct(record: BackendProduct): Product {
  const suppliedImageUrl = record.imageUrl ?? getPictureUrl(record.pictures);
  const imageUrl = suppliedImageUrl
    ? (/^(https?:)?\/\//i.test(suppliedImageUrl) || suppliedImageUrl.startsWith('/')
      ? suppliedImageUrl
      : `/${suppliedImageUrl}`)
    : '/assets/Crafteez.png';

  return {
    id: record.id ?? record.slug ?? record.name ?? 'product',
    name: record.name ?? 'Untitled product',
    price: Number(record.price ?? 0),
    imageUrl,
    description: record.description ?? 'A handmade favorite from Crafteez.',
  };
}
