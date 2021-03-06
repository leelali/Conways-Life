/**
 * Implemention of a CCA
 */

const MODULO = 8;

/**
 * Make a 2D array helper function
 */
function Array2D(width, height) {
	let a = new Array(height);
  
	for (let i = 0; i < height; i++) {
	  a[i] = new Array(width);
	}
  
	return a;
}
  
/**
 * CCA class
 */
class CCA {

  /**
   * Constructor
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.currentBufferIndex = 0;

    // Allocate the double buffer
    this.buffer = [
      Array2D(width, height),
      Array2D(width, height)
    ];

    this.clear();
  }

  /**
   * Return the current active buffer
   * 
   * This should NOT be modified by the caller
   */
  getCells() {
    return this.buffer[this.currentBufferIndex];
  }

  /**
   * Clear the cca grid
   * (i.e. fill with 0s)
   */
  clear() {
    for (let y = 0; y < this.height; y++) {
      this.buffer[this.currentBufferIndex][y].fill(0);
    }
  }

  /**
   * Randomize the cca grid
   */
  randomize() {
    let buffer = this.buffer[this.currentBufferIndex];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        buffer[y][x] = Math.floor(Math.random() * MODULO);
      }
    }
  }

  /**
   * Run the simulation for a single step
   */
  step() {
    let backBufferIndex = this.currentBufferIndex === 0 ? 1 : 0;
    let currentBuffer = this.buffer[this.currentBufferIndex];
    let backBuffer = this.buffer[backBufferIndex];

    // Helper functin to see if cell has "infectious" neighbor
    const hasInfectiousNeighbor = (x, y) => {
      const nextValue = (currentBuffer[y][x] + 1) % MODULO;

      // left 
      if (x > 0) {
        if (currentBuffer[y][x - 1] === nextValue) return true;
      }

      // up
      if (y > 0) {
        if (currentBuffer[y - 1][x] === nextValue) return true;
      }

      // up left corner 
      if (x > 0 && y > 0) {
        if (currentBuffer[y - 1][x - 1] === nextValue) return true;
      }

      // up right corner
      if (x < this.width - 1 && y > 0) {
        if (currentBuffer[y - 1][x + 1] === nextValue) return true;
      }

      // right
      if (x < this.width - 1) {
        if (currentBuffer[y][x + 1] === nextValue) return true;
      }

      // down
      if (y < this.height - 1) {
        if (currentBuffer[y + 1][x] === nextValue) return true;
      }

      // down left corner
      if (x > 0 && y < this.height - 1) {
        if (currentBuffer[y + 1][x - 1] === nextValue) return true;
      }

      // down right cornder
      if (x < this.width - 1 && y < this.height - 1) {
        if (currentBuffer[y + 1][x + 1] === nextValue) return true;
      }

      return false;
    }

    // loop through the currentBuffer and populate the 
    // backBuffer (next genration) based on above helper
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (hasInfectiousNeighbor(x, y)) {
          backBuffer[y][x] = (currentBuffer[y][x] + 1) % MODULO;
        } else {
          backBuffer[y][x] = currentBuffer[y][x];
        }
      }
    }

    this.currentBufferIndex = backBufferIndex;
  }
}

export default CCA;