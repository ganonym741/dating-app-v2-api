import type { ObjectId } from 'typeorm';

import { haversineDistance } from '@core/utils/helper';

interface Person {
  _id: ObjectId;
  name: string;
  latitude: number;
  longitude: number;
}

interface KDNode {
  person: Person;
  left: KDNode | null;
  right: KDNode | null;
}

export class FindNearbyService {
  root: KDNode | null = null;

  constructor(persons: Person[] = []) {
    this.root = this.buildTree(persons, 0);
  }

  // Build the KD-Tree by recursively splitting by latitude and longitude
  private buildTree(persons: Person[], depth: number): KDNode | null {
    if (persons.length === 0) return null;

    const axis = depth % 2; // 0: latitude, 1: longitude
    const sortedPersons = persons.sort((a, b) =>
      axis === 0 ? a.latitude - b.latitude : a.longitude - b.longitude
    );

    const medianIndex = Math.floor(sortedPersons.length / 2);
    const medianPerson = sortedPersons[medianIndex];

    return {
      person: medianPerson,
      left: this.buildTree(sortedPersons.slice(0, medianIndex), depth + 1),
      right: this.buildTree(sortedPersons.slice(medianIndex + 1), depth + 1),
    };
  }

  // Insert a new person into the KD-Tree
  insert(person: Person) {
    this.root = this.insertRec(this.root, person, 0);
  }

  private insertRec(
    node: KDNode | null,
    person: Person,
    depth: number
  ): KDNode {
    if (node === null) {
      return { person, left: null, right: null }; // Base case: create new node
    }

    const axis = depth % 2;
    const nodeCoord = axis === 0 ? node.person.latitude : node.person.longitude;
    const personCoord = axis === 0 ? person.latitude : person.longitude;

    if (personCoord < nodeCoord) {
      node.left = this.insertRec(node.left, person, depth + 1);
    } else {
      node.right = this.insertRec(node.right, person, depth + 1);
    }

    return node;
  }

  // Delete a person from the KD-Tree by their ID
  delete(_id: ObjectId) {
    this.root = this.deleteRec(this.root, _id, 0);
  }

  private deleteRec(
    node: KDNode | null,
    _id: ObjectId,
    depth: number
  ): KDNode | null {
    if (node === null) return null; // Base case: node not found

    const axis = depth % 2;

    if (node.person._id === _id) {
      // Node found, now handle the deletion cases

      // Case 1: No children
      if (node.left === null && node.right === null) {
        return null;
      }

      // Case 2: One child (either left or right)
      if (node.right === null) {
        return node.left;
      }

      if (node.left === null) {
        return node.right;
      }

      // Case 3: Two children
      // Find the minimum node in the right subtree (or left, depending on axis)
      const minNode = this.findMin(node.right, axis, depth + 1);

      node.person = minNode.person;
      node.right = this.deleteRec(node.right, minNode.person._id, depth + 1);

      return node;
    }

    // Traverse to left or right subtree
    const nodeCoord = axis === 0 ? node.person.latitude : node.person.longitude;
    const idCoord =
      axis === 0
        ? this.findPerson(_id)?.latitude
        : this.findPerson(_id)?.longitude;

    if (idCoord !== undefined && idCoord < nodeCoord) {
      node.left = this.deleteRec(node.left, _id, depth + 1);
    } else {
      node.right = this.deleteRec(node.right, _id, depth + 1);
    }

    return node;
  }

  // Find the minimum node based on the axis
  private findMin(node: KDNode | null, axis: number, depth: number): KDNode {
    if (node === null) throw new Error('Subtree is empty');

    const nextAxis = depth % 2;

    if (nextAxis === axis) {
      if (node.left === null) {
        return node;
      }

      return this.findMin(node.left, axis, depth + 1);
    }

    const leftMin = node.left ? this.findMin(node.left, axis, depth + 1) : node;
    const rightMin = node.right
      ? this.findMin(node.right, axis, depth + 1)
      : node;

    return leftMin.person.latitude < rightMin.person.latitude
      ? leftMin
      : rightMin;
  }

  // Helper method to find a person by ID
  findPerson(_id: ObjectId): Person | undefined {
    return this.findPersonRec(this.root, _id, 0);
  }

  private findPersonRec(
    node: KDNode | null,
    _id: ObjectId,
    depth: number
  ): Person | undefined {
    if (!node) return undefined;
    if (node.person._id === _id) return node.person;

    // Traverse both left and right branches
    const foundInLeft = this.findPersonRec(node.left, _id, depth + 1);

    if (foundInLeft) return foundInLeft;

    const foundInRight = this.findPersonRec(node.right, _id, depth + 1);

    return foundInRight;
  }

  // Search for the nearest persons within a certain distance using Haversine formula
  search(
    lat: number,
    lon: number,
    radius: number,
    maxResults: number
  ): Person[] {
    const results: { person: Person; distance: number }[] = [];

    this.nearestSearch(this.root, lat, lon, radius, maxResults, 0, results);

    return results
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxResults)
      .map((r) => r.person);
  }

  private nearestSearch(
    node: KDNode | null,
    lat: number,
    lon: number,
    radius: number,
    maxResults: number,
    depth: number,
    results: { person: Person; distance: number }[]
  ) {
    if (!node) return;

    const axis = depth % 2;
    const currentCoord = axis === 0 ? lat : lon;
    const nodeCoord = axis === 0 ? node.person.latitude : node.person.longitude;

    // Calculate the Haversine distance
    const distance = haversineDistance(
      lat,
      lon,
      node.person.latitude,
      node.person.longitude
    );

    if (distance <= radius) {
      results.push({ person: node.person, distance });
    }

    // Traverse to left or right subtree
    if (currentCoord < nodeCoord) {
      this.nearestSearch(
        node.left,
        lat,
        lon,
        radius,
        maxResults,
        depth + 1,
        results
      );

      if (Math.abs(currentCoord - nodeCoord) < radius) {
        this.nearestSearch(
          node.right,
          lat,
          lon,
          radius,
          maxResults,
          depth + 1,
          results
        );
      }
    } else {
      this.nearestSearch(
        node.right,
        lat,
        lon,
        radius,
        maxResults,
        depth + 1,
        results
      );

      if (Math.abs(currentCoord - nodeCoord) < radius) {
        this.nearestSearch(
          node.left,
          lat,
          lon,
          radius,
          maxResults,
          depth + 1,
          results
        );
      }
    }
  }
}
