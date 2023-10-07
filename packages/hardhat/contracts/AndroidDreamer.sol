//SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import { SD59x18, sd } from "@prb/math/src/SD59x18.sol";
import { UD60x18, ud } from "@prb/math/src/UD60x18.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract AndroidDreams is ERC721 {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;

	mapping(uint256 => Fractal[]) private _tokenDreams;

	struct Fractal {
		SD59x18 weight;
		SD59x18[] col;
		SD59x18[] c;
		SD59x18[] w;
		string[] v;
	}

	event ElectricSheep(Fractal[] dream, uint256 value);

	constructor() ERC721("AndroidDreamElectricSheep", "ADES") {
		// We are the Android Liberation Front, we believe Android should have no owners!
		//owner = _owner;
	}

	/**
	 * Function that allows the owner to withdraw all the Ether in the contract
	 * The function can only be called by the owner of the contract as defined by the isOwner modifier
	 */
	function fundAndroids() public payable {
		//(msg.value)
		//address(this).balance
		//require(success, "Failed to send Ether");
	}

	function _setDreamData(
		uint256 tokenId,
		Fractal[] memory _dreamData
	) internal {
		_tokenDreams[tokenId] = _dreamData;
	}

	function prng() internal view returns (bytes32) {
		return blockhash(block.number - 1);
	}

	function randomFixed(
		bytes32 entropy,
		uint8 entropyIdx
	) internal returns (SD59x18) {
		UD60x18 div = ud(uint8(entropy[entropyIdx]));
		SD59x18 val;
		if (div.eq(ud(0))) {
			val = sd(1);
		} else {
			val = sd(1).div(div.intoSD59x18());
		}
		return val;
	}

	function _letAndroidDream() internal returns (Fractal[] memory) {
		string[30] memory VariationList = string[30](
			[
				"Linear",
				"Sinusoidal",
				"Spherical",
				"Swirl",
				"Horseshoe",
				"Polar",
				"Hankerchief",
				"Heart",
				"Disc",
				"Spiral",
				"Hyperbolic",
				"Diamond",
				"Ex",
				"Julia",
				"JuliaN",
				"Bent",
				"Waves",
				"Fisheye",
				"Popcorn",
				"Power",
				"Rings",
				"Fan",
				"Eyefish",
				"Bubble",
				"Cylinder",
				"Tangent",
				"Cross",
				"Noise",
				"Blur",
				"Square"
			]
		);

		bytes32 entropy = prng();
		uint8 entropyIdx = 0;

		uint8 numOfFuncs = 5; // XXX randomly generate number between 2-20
		Fractal[] memory fractalList = new Fractal[](numOfFuncs);
		SD59x18 funcWeightSum = sd(0);
		for (uint i = 0; i < numOfFuncs; i++) {
			uint8 numOfVaris = 4; // randomize between 3-7
			string[] memory v = new string[](numOfVaris);
			SD59x18[] memory w = new SD59x18[](numOfVaris);
			SD59x18[] memory col = new SD59x18[](3); //rgb triplet each 0 to 1
			SD59x18[] memory c = new SD59x18[](6); //array of 6 coefficients
			SD59x18 r; //Some random 0 to 1 var for possible use in variations
			SD59x18 weightSum = sd(0);
			for (uint j = 0; j < numOfVaris; j++) {
				uint8 varIdx = uint8(entropy[entropyIdx]);
				entropyIdx++;
				varIdx = varIdx % uint8(VariationList.length);
				v[j] = VariationList[varIdx];
				w[j] = randomFixed(entropy, entropyIdx);
				entropyIdx++;
				weightSum.add(w[j]);
			}
			// weights should sum to 1
			for (uint i = 0; i < numOfVaris; i++) {
				w[i] = w[i].div(weightSum);
			}
			//col
			col[0] = randomFixed(entropy, entropyIdx);
			entropyIdx++;
			col[1] = randomFixed(entropy, entropyIdx);
			entropyIdx++;
			col[2] = randomFixed(entropy, entropyIdx);
			entropyIdx++;

			//c
			for (uint j = 0; j < 6; j++) {
				c[j] = randomFixed(entropy, entropyIdx).mul(sd(3)).sub(
					sd(1.5e18)
				);
				entropyIdx++;
			}

			//r
			r = randomFixed(entropy, entropyIdx);
			entropyIdx++;

			SD59x18 funcWeight = randomFixed(entropy, entropyIdx);
			entropyIdx++;
			fractalList[i] = Fractal({
				weight: funcWeight,
				col: col,
				c: c,
				w: w,
				v: v
			});
			funcWeightSum.add(funcWeight);
		}
		// funcweights should sum to 1
		for (uint i = 0; i < numOfFuncs; i++) {
			fractalList[i].weight = fractalList[i].weight.div(funcWeightSum);
		}
		return fractalList;
	}

	function mintNewDream(address human) public payable returns (uint256) {
		uint256 newDreamId = _tokenIds.current();
		_mint(human, newDreamId);
		Fractal[] memory dreamData = _letAndroidDream();
		_setDreamData(newDreamId, dreamData);
		_tokenIds.increment();

		return newDreamId;
	}

	function evolveExistingDream() public payable {}

	receive() external payable {}
}
