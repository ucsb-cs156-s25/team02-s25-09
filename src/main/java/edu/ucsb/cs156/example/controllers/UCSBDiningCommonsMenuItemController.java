package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.UCSBDate;
import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItem;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.UCSBDateRepository;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import java.time.LocalDateTime;

/**
 * This is a REST controller for UCSBDiningCommonsMenuItem
 */

@Tag(name = "UCSBDiningCommonsMenuItem")
@RequestMapping("/api/ucsbdiningcommonsmenuitem")
@RestController
@Slf4j
public class UCSBDiningCommonsMenuItemController extends ApiController {

  @Autowired
  UCSBDiningCommonsMenuItemRepository ucsbDiningCommonsMenuItemRepository;

  /**
   * List all UCSB Dining Commmons Menu Items
   * 
   * @return an iterable of UCSBDiningCommonsMenuItem
   */
  @Operation(summary = "List all ucsb items")
  @PreAuthorize("hasRole('ROLE_USER')")
  @GetMapping("/all")
  public Iterable<UCSBDiningCommonsMenuItem> allUCSBDiningCommonsMenuItem() {
    Iterable<UCSBDiningCommonsMenuItem> items = ucsbDiningCommonsMenuItemRepository.findAll();
    return items;
  }

  /**
   * Get a single item by id
   * 
   * @param id the id of the item
   * @return a UCSBDiningCommonsMenuItem
   */
  @Operation(summary = "Get a single item")
  @PreAuthorize("hasRole('ROLE_USER')")
  @GetMapping("")
  public UCSBDiningCommonsMenuItem getById(
      @Parameter(name = "id") @RequestParam Long id) {
    UCSBDiningCommonsMenuItem ucsbDiningCommonsMenuItem = ucsbDiningCommonsMenuItemRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));

    return ucsbDiningCommonsMenuItem;
  }

  /**
   * Create a new item
   * 
   * @param diningCommonsCode the code of the dining common
   * @param name              the name of the itenm
   * @param station           the station where the item is located
   * @return the saved item
   */
  @Operation(summary = "Create a new item")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PostMapping("/post")
  public UCSBDiningCommonsMenuItem postUCSBDiningCommonsMenuItem(
      @Parameter(name = "diningCommonsCode") @RequestParam String diningCommonsCode,
      @Parameter(name = "name") @RequestParam String name,
      @Parameter(name = "station") @RequestParam String station)
      throws JsonProcessingException {

    UCSBDiningCommonsMenuItem ucsbDiningCommonsMenuItem = new UCSBDiningCommonsMenuItem();
    ucsbDiningCommonsMenuItem.setDiningCommonsCode(diningCommonsCode);
    ucsbDiningCommonsMenuItem.setName(name);
    ucsbDiningCommonsMenuItem.setStation(station);

    UCSBDiningCommonsMenuItem savedUcsbDiningCommonsMenuItem = ucsbDiningCommonsMenuItemRepository
        .save(ucsbDiningCommonsMenuItem);

    return savedUcsbDiningCommonsMenuItem;
  }

  /**
   * Update a single item
   * 
   * @param id       id of the item to update
   * @param incoming the new item
   * @return the updated UCSBDiningCommonsMenuItem object
   */
  @Operation(summary = "Update a single item")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PutMapping("")
  public UCSBDiningCommonsMenuItem updateUCSBDiningCommonsMenuItem(
      @Parameter(name = "id") @RequestParam Long id,
      @RequestBody @Valid UCSBDiningCommonsMenuItem incoming) {

    UCSBDiningCommonsMenuItem ucsbDiningCommonsMenuItem = ucsbDiningCommonsMenuItemRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));

    ucsbDiningCommonsMenuItem.setDiningCommonsCode(incoming.getDiningCommonsCode());
    ucsbDiningCommonsMenuItem.setName(incoming.getName());
    ucsbDiningCommonsMenuItem.setStation(incoming.getStation());

    ucsbDiningCommonsMenuItemRepository.save(ucsbDiningCommonsMenuItem);

    return ucsbDiningCommonsMenuItem;
  }

  /**
   * Delete a UCSBDiningCommonsMenuItem
   * 
   * @param id the id of the item to delete
   * @return a message indicating the item was deleted
   */
  @Operation(summary = "Delete a UCSBDiningCommoneMenuItem")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @DeleteMapping("")
  public Object deleteUCSBDiningCommonMenObject(
      @Parameter(name = "id") @RequestParam Long id) {
    UCSBDiningCommonsMenuItem ucsbDiningCommonsMenuItem = ucsbDiningCommonsMenuItemRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));

    ucsbDiningCommonsMenuItemRepository.delete(ucsbDiningCommonsMenuItem);
    return genericMessage("UCSBDiningCommonsMenuItem with id %s deleted".formatted(id));
  }

}
