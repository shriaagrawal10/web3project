// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title CertificateNFT
 * @dev ERC721 contract for issuing educational certificates as NFTs
 */
contract CertificateNFT is ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;
    
    // Roles
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    
    // Certificate counter for token IDs
    Counters.Counter private _certificateIds;
    
    // Certificate metadata structure
    struct CertificateMetadata {
        string studentName;
        address studentAddress;
        string courseName;
        string courseDescription;
        uint256 issueDate;
        uint256 expirationDate;
        address issuer;
        string ipfsHash;
    }
    
    // Mapping from token ID to certificate metadata
    mapping(uint256 => CertificateMetadata) private _certificateDetails;
    
    // Events
    event CertificateMinted(
        uint256 tokenId,
        address indexed to,
        address indexed issuer,
        string courseName,
        uint256 issueDate
    );
    
    event CertificateVerified(
        uint256 tokenId,
        bool verified,
        address verifier
    );
    
    /**
     * @dev Constructor
     */
    constructor() ERC721("BlockCertify Certificate", "CERT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
    }
    
    /**
     * @dev Mint a new certificate NFT
     * @param to Address of the certificate recipient
     * @param tokenURI IPFS URI containing certificate image
     * @param studentName Name of the student
     * @param courseName Name of the course
     * @param courseDescription Description of the course content
     * @param expirationDate Expiration timestamp (0 for no expiration)
     * @param ipfsHash IPFS hash of additional metadata
     */
    function mintCertificate(
        address to,
        string memory tokenURI,
        string memory studentName,
        string memory courseName,
        string memory courseDescription,
        uint256 expirationDate,
        string memory ipfsHash
    ) public onlyRole(ISSUER_ROLE) returns (uint256) {
        // Increment certificate ID
        _certificateIds.increment();
        uint256 newCertificateId = _certificateIds.current();
        
        // Mint NFT
        _mint(to, newCertificateId);
        _setTokenURI(newCertificateId, tokenURI);
        
        // Store certificate metadata
        _certificateDetails[newCertificateId] = CertificateMetadata({
            studentName: studentName,
            studentAddress: to,
            courseName: courseName,
            courseDescription: courseDescription,
            issueDate: block.timestamp,
            expirationDate: expirationDate,
            issuer: msg.sender,
            ipfsHash: ipfsHash
        });
        
        // Emit event
        emit CertificateMinted(
            newCertificateId,
            to,
            msg.sender,
            courseName,
            block.timestamp
        );
        
        return newCertificateId;
    }
    
    /**
     * @dev Get certificate details
     * @param tokenId Token ID of the certificate
     */
    function getCertificateDetails(uint256 tokenId) public view returns (
        string memory studentName,
        address studentAddress,
        string memory courseName,
        string memory courseDescription,
        uint256 issueDate,
        uint256 expirationDate,
        address issuer,
        string memory ipfsHash
    ) {
        require(_exists(tokenId), "Certificate does not exist");
        
        CertificateMetadata memory metadata = _certificateDetails[tokenId];
        
        return (
            metadata.studentName,
            metadata.studentAddress,
            metadata.courseName,
            metadata.courseDescription,
            metadata.issueDate,
            metadata.expirationDate,
            metadata.issuer,
            metadata.ipfsHash
        );
    }
    
    /**
     * @dev Verify certificate authenticity
     * @param tokenId Token ID of the certificate to verify
     */
    function verifyCertificate(uint256 tokenId) public returns (bool) {
        bool exists = _exists(tokenId);
        
        emit CertificateVerified(
            tokenId,
            exists,
            msg.sender
        );
        
        return exists;
    }
    
    /**
     * @dev Add a new issuer
     * @param issuer Address of the new issuer
     */
    function addIssuer(address issuer) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(ISSUER_ROLE, issuer);
    }
    
    /**
     * @dev Remove an issuer
     * @param issuer Address of the issuer to remove
     */
    function removeIssuer(address issuer) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(ISSUER_ROLE, issuer);
    }
    
    /**
     * @dev Check if an address is an authorized issuer
     * @param issuer Address to check
     */
    function isIssuer(address issuer) public view returns (bool) {
        return hasRole(ISSUER_ROLE, issuer);
    }
    
    // Override required function
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}