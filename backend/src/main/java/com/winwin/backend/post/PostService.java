package com.winwin.backend.post;

import com.winwin.backend.post.dto.CreatePostRequest;
import com.winwin.backend.post.dto.PostResponse;
import com.winwin.backend.post.dto.UpdatePostStatusRequest;
import com.winwin.backend.security.AuthenticatedUser;
import com.winwin.backend.user.UserRepository;
import com.winwin.backend.user.UserRole;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PostService {

  private final MatchingPostRepository matchingPostRepository;
  private final UserRepository userRepository;

  public PostService(MatchingPostRepository matchingPostRepository, UserRepository userRepository) {
    this.matchingPostRepository = matchingPostRepository;
    this.userRepository = userRepository;
  }

  @Transactional
  public PostResponse createPartnerPost(CreatePostRequest request, AuthenticatedUser authenticatedUser) {
    var owner = requirePartnerUser(authenticatedUser);

    MatchingPost post = new MatchingPost();
    post.setOwner(owner);
    applyDraft(post, request);
    post.setStatus(PostStatus.OPEN);

    return toResponse(matchingPostRepository.save(post));
  }

  @Transactional(readOnly = true)
  public List<PostResponse> getPartnerPosts(AuthenticatedUser authenticatedUser) {
    requirePartnerRole(authenticatedUser);
    return matchingPostRepository.findByOwnerIdOrderByCreatedAtDesc(authenticatedUser.userId()).stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public PostResponse getPartnerPost(Long postId, AuthenticatedUser authenticatedUser) {
    requirePartnerRole(authenticatedUser);
    return toResponse(requireOwnedPost(postId, authenticatedUser.userId()));
  }

  @Transactional(readOnly = true)
  public List<PostResponse> getDiscoverablePosts() {
    return matchingPostRepository.findByStatusOrderByCreatedAtDesc(PostStatus.OPEN).stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public PostResponse getDiscoverablePost(Long postId) {
    MatchingPost post =
        matchingPostRepository
            .findWithDetailsById(postId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

    if (post.getStatus() != PostStatus.OPEN) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
    }

    return toResponse(post);
  }

  @Transactional
  public PostResponse updatePartnerPost(
      Long postId, CreatePostRequest request, AuthenticatedUser authenticatedUser) {
    requirePartnerRole(authenticatedUser);

    MatchingPost post = requireOwnedPost(postId, authenticatedUser.userId());
    applyDraft(post, request);
    return toResponse(post);
  }

  @Transactional
  public PostResponse updatePartnerPostStatus(
      Long postId, UpdatePostStatusRequest request, AuthenticatedUser authenticatedUser) {
    requirePartnerRole(authenticatedUser);

    MatchingPost post = requireOwnedPost(postId, authenticatedUser.userId());
    post.setStatus(request.status());
    return toResponse(post);
  }

  private void requirePartnerRole(AuthenticatedUser authenticatedUser) {
    if (authenticatedUser.role() != UserRole.PARTNER) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Partner role is required");
    }
  }

  private com.winwin.backend.user.UserAccount requirePartnerUser(AuthenticatedUser authenticatedUser) {
    requirePartnerRole(authenticatedUser);

    return userRepository
        .findById(authenticatedUser.userId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
  }

  private MatchingPost requireOwnedPost(Long postId, Long ownerId) {
    MatchingPost post =
        matchingPostRepository
            .findWithDetailsById(postId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

    if (!post.getOwner().getId().equals(ownerId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot access another partner's post");
    }

    return post;
  }

  private PostResponse toResponse(MatchingPost post) {
    return new PostResponse(
        post.getId(),
        post.getCategory().name(),
        post.getShopName(),
        post.getLocation(),
        post.getLocationLatitude(),
        post.getLocationLongitude(),
        post.getLocationDetail(),
        post.getLocationDetailLatitude(),
        post.getLocationDetailLongitude(),
        post.getLocationVisibility().name(),
        post.getService(),
        List.copyOf(post.getRequirements()),
        post.getAvailableDates().stream().map(Object::toString).toList(),
        post.getDeposit(),
        post.getDescription(),
        post.getStatus().name(),
        post.getOwner().getId(),
        post.getOwner().getName(),
        post.getCreatedAt(),
        post.getUpdatedAt());
  }

  private String trimToNull(String value) {
    if (value == null) {
      return null;
    }

    var trimmed = value.trim();
    return trimmed.isEmpty() ? null : trimmed;
  }

  private void applyDraft(MatchingPost post, CreatePostRequest request) {
    post.setCategory(request.category());
    post.setShopName(request.shopName().trim());
    post.setLocation(request.location().trim());
    post.setLocationLatitude(request.locationLatitude());
    post.setLocationLongitude(request.locationLongitude());
    post.setLocationDetail(trimToNull(request.locationDetail()));
    post.setLocationDetailLatitude(request.locationDetailLatitude());
    post.setLocationDetailLongitude(request.locationDetailLongitude());
    post.setLocationVisibility(request.locationVisibility());
    post.setService(request.service().trim());
    post.setRequirements(request.requirements().stream().map(String::trim).toList());
    post.setAvailableDates(request.availableDates().stream().sorted(Comparator.naturalOrder()).toList());
    post.setDeposit(request.deposit());
    post.setDescription(trimToNull(request.description()));
  }
}
