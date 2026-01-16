// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract CrossTheRoadNFT is ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;

    // Mapping from token ID to score
    mapping(uint256 => uint256) public scores;
    // Mapping from token ID to timestamp
    mapping(uint256 => uint256) public mintDates;

    constructor() ERC721("CrossTheRoad Score", "cXc") Ownable(msg.sender) {}

    function mint(address to, uint256 score) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        
        scores[tokenId] = score;
        mintDates[tokenId] = block.timestamp;
        
        _setTokenURI(tokenId, generateTokenURI(tokenId, score));
        
        return tokenId;
    }

    // Generate on-chain SVG metadata
    function generateTokenURI(uint256 tokenId, uint256 score) internal view returns (string memory) {
        
        string memory svg = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            '<style>.base { fill: white; font-family: serif; font-size: 24px; }</style>',
            '<rect width="100%" height="100%" fill="orange" />',
            '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">Cross The Road</text>',
            '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">Score: ', score.toString(), '</text>',
            '<text x="50%" y="60%" class="base" dominant-baseline="middle" text-anchor="middle">ID: #', tokenId.toString(), '</text>',
            '</svg>'
        ));

        string memory json = string(abi.encodePacked(
            '{"name": "CrossTheRoad #', tokenId.toString(), 
            '", "description": "A high score record from Cross The Road.", "image": "data:image/svg+xml;base64,', 
            Base64.encode(bytes(svg)), 
            '", "attributes": [{"trait_type": "Score", "value": ', score.toString(), 
            '}, {"trait_type": "Date", "value": ', mintDates[tokenId].toString(), '}]}'
        ));

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }
}
