//SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { SD59x18, sd } from "@prb/math/src/SD59x18.sol";
import { UD60x18, ud } from "@prb/math/src/UD60x18.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import { Seriality } from "seriality/src/Seriality.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract AndroidDreamer is ERC721 {
	uint256 private _tokenIdx;

	mapping(uint256 => string) private _tokenData;

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

	function tokenData(uint256 tokenId) public view returns (string memory) {
		_requireOwned(tokenId);
		string memory data = _tokenData[tokenId];
		return data;
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

	function _setDreamData(uint256 tokenId, string memory _dreamData) internal {
		_tokenData[tokenId] = _dreamData;
	}

	function prng() internal view returns (bytes32) {
		return blockhash(block.number - 1);
	}

	function randomFixed(
		bytes32 entropy,
		uint8 entropyIdx
	) internal returns (SD59x18) {
		UD60x18 div = ud(uint8(entropy[entropyIdx % entropy.length]));
		if (div.eq(ud(0))) {
			return sd(1);
		}
		return sd(1).div(div.intoSD59x18());
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

		uint8 numOfFuncs = 3; // XXX randomly generate number between 2-20
		Fractal[] memory fractalList = new Fractal[](numOfFuncs);
		SD59x18 funcWeightSum = sd(0);
		for (uint i = 0; i < numOfFuncs; i++) {
			uint8 numOfVaris = 4; // randomize between 3-7
			fractalList[i] = Fractal({
				weight: sd(0),
				col: new SD59x18[](3), //rgb triplet each 0 to 1,
				c: new SD59x18[](6), //array of 6 coefficients,
				w: new SD59x18[](numOfVaris),
				v: new string[](numOfVaris)
			});
			//SD59x18 r; //Some random 0 to 1 var for possible use in variations
			SD59x18 weightSum = sd(0);
			for (uint j = 0; j < numOfVaris; j++) {
				uint8 varIdx = uint8(entropy[entropyIdx % entropy.length]);
				entropyIdx++;
				varIdx = varIdx % uint8(VariationList.length);
				fractalList[i].v[j] = VariationList[varIdx];
				fractalList[i].w[j] = randomFixed(entropy, entropyIdx);
				entropyIdx++;
				weightSum = weightSum.add(fractalList[i].w[j]);
			}
			// weights should sum to 1
			for (uint j = 0; j < numOfVaris; j++) {
				fractalList[i].w[j] = fractalList[i].w[j].div(weightSum);
			}
			//col
			fractalList[i].col[0] = randomFixed(entropy, entropyIdx);
			entropyIdx++;
			fractalList[i].col[1] = randomFixed(entropy, entropyIdx);
			entropyIdx++;
			fractalList[i].col[2] = randomFixed(entropy, entropyIdx);
			entropyIdx++;

			//c
			for (uint j = 0; j < 6; j++) {
				fractalList[i].c[j] = randomFixed(entropy, entropyIdx)
					.mul(sd(3))
					.sub(sd(1.5e18));
				entropyIdx++;
			}
			//r
			//r = randomFixed(entropy, entropyIdx);
			entropyIdx++;
			fractalList[i].weight = randomFixed(entropy, entropyIdx);
			entropyIdx++;

			funcWeightSum = funcWeightSum.add(fractalList[i].weight);
		}
		// funcweights should sum to 1
		for (uint j = 0; j < numOfFuncs; j++) {
			fractalList[j].weight = fractalList[j].weight.div(funcWeightSum);
		}
		return fractalList;
	}

	function sd59ToString(SD59x18 s) internal returns (string memory) {
		return Strings.toStringSigned(s.unwrap());
	}

	function encodeFractalList(
		Fractal[] memory fractalList
	) internal returns (string memory) {
		string memory result = "[";

		for (uint i = 0; i < fractalList.length; i++) {
			result = string.concat(result, '{"weight":');
			result = string.concat(result, sd59ToString(fractalList[i].weight));
			result = string.concat(result, ',"col":[');
			for (uint j = 0; j < fractalList[i].col.length; j++) {
				result = string.concat(
					result,
					sd59ToString(fractalList[i].col[j])
				);
				if (j == fractalList[i].col.length - 1) {
					break;
				}
				result = string.concat(result, ",");
			}
			result = string.concat(result, '],"c":[');
			for (uint j = 0; j < fractalList[i].c.length; j++) {
				result = string.concat(
					result,
					sd59ToString(fractalList[i].c[j])
				);
				if (j == fractalList[i].c.length - 1) {
					break;
				}
				result = string.concat(result, ",");
			}
			result = string.concat(result, '],"v":[');
			for (uint j = 0; j < fractalList[i].v.length; j++) {
				result = string.concat(result, '"');
				result = string.concat(result, fractalList[i].v[j]);
				result = string.concat(result, '"');
				if (j == fractalList[i].v.length - 1) {
					break;
				}
				result = string.concat(result, ",");
			}
			result = string.concat(result, '],"w":');
			for (uint j = 0; j < fractalList[i].w.length; j++) {
				result = string.concat(
					result,
					sd59ToString(fractalList[i].w[j])
				);
				if (j == fractalList[i].w.length - 1) {
					break;
				}
				result = string.concat(result, ",");
			}
			if (i == fractalList.length - 1) {
				result = string.concat(result, "}");
				break;
			}
			result = string.concat(result, "},");
		}
		result = string.concat(result, "]");
		return result;
	}

	function mintNewDream(address human) public payable returns (uint256) {
		uint256 newDreamId = _tokenIdx;
		_mint(human, newDreamId);
		Fractal[] memory fractalList = _letAndroidDream();
		string memory dreamData = encodeFractalList(fractalList);
		_setDreamData(newDreamId, dreamData);
		_tokenIdx += 1;

		return newDreamId;
	}

	function evolveExistingDream(
		uint256 dreamA,
		uint256 dreamB
	) public payable {}

	receive() external payable {}
}
