package com.winwin.backend.post;

import com.winwin.backend.post.dto.PostResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PostController {

  private final PostService postService;

  public PostController(PostService postService) {
    this.postService = postService;
  }

  @GetMapping("/api/posts")
  public List<PostResponse> getDiscoverablePosts() {
    return postService.getDiscoverablePosts();
  }

  @GetMapping("/api/posts/{postId}")
  public PostResponse getDiscoverablePost(@PathVariable Long postId) {
    return postService.getDiscoverablePost(postId);
  }
}
