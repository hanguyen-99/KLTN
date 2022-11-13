package com.document.manager.algorithm;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class AlgorithmTest {

    @Test
    public void test() {
        String s1 = "Suppose that X represent a algorithm for the rows of the dynamic programming array and Y";
        String s2 = "Suppose that X represent the rows of the dynamic programming array and Y represent the columns";
        float percent = Algorithm.runAlgorithm(s1, s2);
        Assert.assertEquals(59.0, percent, 2);
    }

    @Test
    public void testExample() {
        String s1 = "Tôi học ngành công nghệ thông tin";
        String s2 = "Tôi học kế ngành công nghệ thông tin";
        float percent = Algorithm.runAlgorithm(s1, s2);
        Assert.assertEquals(93.0, percent, 2);
    }

    @Test
    public void testTwoTheSameSentence() {
        String s1 = "Tôi học ngành công nghệ thông tin";
        String s2 = "Tôi học ngành công nghệ thông tin";
        float percent = Algorithm.runAlgorithm(s1, s2);
        Assert.assertEquals(100.0, percent, 2);
    }

    @Test
    public void testExampleInReport() {
        String s1 = "a b c d e f g";
        String s2 = "a b h c k e f g";
        float percent = Algorithm.runAlgorithm(s1, s2);
        Assert.assertEquals(75.0, percent, 2);
    }

    @Test
    public void testExampleTwoInReport() {
        String s1 = "a b c d e f g h i";
        String s2 = "a b c x d e f g h";
        float percent = Algorithm.runAlgorithm(s1, s2);
        Assert.assertEquals(80.0, percent, 2);
    }
}