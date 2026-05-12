package com.winwin.backend.post;

import com.winwin.backend.post.dto.CreatePostRequest;
import com.winwin.backend.post.dto.PostResponse;
import com.winwin.backend.post.dto.UpdatePostStatusRequest;
import com.winwin.backend.security.AuthenticatedUser;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/partner/posts")
public class PartnerPostController {

  private final PostService postService;

  public PartnerPostController(PostService postService) {
    this.postService = postService;
  }

  @PostMapping
  public PostResponse createPartnerPost(
      @Valid @RequestBody CreatePostRequest request,
      @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return postService.createPartnerPost(request, authenticatedUser);
  }

  @GetMapping
  public List<PostResponse> getPartnerPosts(
      @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return postService.getPartnerPosts(authenticatedUser);
  }

  @GetMapping("/{postId}")
  public PostResponse getPartnerPost(
      @PathVariable Long postId, @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return postService.getPartnerPost(postId, authenticatedUser);
  }

  @PutMapping("/{postId}")
  public PostResponse updatePartnerPost(
      @PathVariable Long postId,
      @Valid @RequestBody CreatePostRequest request,
      @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return postService.updatePartnerPost(postId, request, authenticatedUser);
  }

  @PatchMapping("/{postId}/status")
  public PostResponse updatePartnerPostStatus(
      @PathVariable Long postId,
      @Valid @RequestBody UpdatePostStatusRequest request,
      @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return postService.updatePartnerPostStatus(postId, request, authenticatedUser);
  }
}
