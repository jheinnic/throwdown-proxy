pragma solidity ^0.4.25;

import "openzeppelin-zos/contracts/ownership/Ownable.sol";
import "openzeppelin-zos/contracts/math/SafeMath.sol";


contract Administratable is Ownable {
    using SafeMath for uint256;

    uint256 public totalAdminsMapping;
    uint256 public totalSuperAdminsMapping;
    mapping (uint256 => address) public adminsForIndex;
    mapping (uint256 => address) public superAdminsForIndex;
    mapping (address => bool) public admins;
    mapping (address => bool) public superAdmins;
    mapping (address => bool) private processedAdmin;
    mapping (address => bool) private processedSuperAdmin;

    event AddAdmin(address indexed admin);
    event RemoveAdmin(address indexed admin);
    event AddSuperAdmin(address indexed admin);
    event RemoveSuperAdmin(address indexed admin);

    modifier onlyAdmins {
        if (msg.sender != owner && !superAdmins[msg.sender] && !admins[msg.sender]) revert();
        _;
    }

    modifier onlySuperAdmins {
        if (msg.sender != owner && !superAdmins[msg.sender]) revert();
        _;
    }

    function addSuperAdmin(address admin) public onlyOwner {
        superAdmins[admin] = true;
        if (!processedSuperAdmin[admin]) {
            processedSuperAdmin[admin] = true;
            superAdminsForIndex[totalSuperAdminsMapping] = admin;
            totalSuperAdminsMapping = totalSuperAdminsMapping.add(1);
        }

        AddSuperAdmin(admin);
    }

    function removeSuperAdmin(address admin) public onlyOwner {
        superAdmins[admin] = false;

        RemoveSuperAdmin(admin);
    }

    function addAdmin(address admin) public onlySuperAdmins {
        admins[admin] = true;
        if (!processedAdmin[admin]) {
            processedAdmin[admin] = true;
            adminsForIndex[totalAdminsMapping] = admin;
            totalAdminsMapping = totalAdminsMapping.add(1);
        }

        AddAdmin(admin);
    }

    function removeAdmin(address admin) public onlySuperAdmins {
        admins[admin] = false;

        RemoveAdmin(admin);
    }
}